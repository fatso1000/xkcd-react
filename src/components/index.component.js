import React, { Component } from 'react'

import '../App.css';

import Loader from './loader.component';

// Componente funcional | child 
const Comic = props => (
    <div className="container border-lg rounded bg-dark text-white">
        <h2>Titulo: {props.comic.title}</h2>
        <p>{props.comic.safe_title}</p>
        <p>Año: {props.comic.year}</p>
        <p>Comic n° {props.comic.num}</p>
        <div className="img-margin">
            <img src={props.comic.img} className="img-fluid" alt={props.comic.alt}/>
        </div>
        <blockquote className="blockquote border rounded bg-secondary text-white mb-1">
            <p className="mb-0">{props.comic.transcript}</p>
        </blockquote>
    </div>
)

// Componente father Index
export default class Index extends Component {
    constructor(props) {
        super(props);

        // BINDS
        this.onChangeSearch = this.onChangeSearch.bind(this); // Le permite utilizar 'this' a la funcion onChangeSearch
        this.onSubmit = this.onSubmit.bind(this);
        this.fetchComic = this.fetchComic.bind(this);

        // DECLARACION VARIABLES
        this.state = { 
            comic_num: '', 
            comic: {}, 
            isSubmitted: false, 
            petition: {
                loading: false,
                error: null,
            },
        };
    }

    onChangeSearch(e) {
        // Cambia el valor de comic_num al escribir en el input de search
        this.setState({
            comic_num: e.target.value,
        });
    }

    // Al apretar el boton de submit del form
    onSubmit(e) {
        e.preventDefault();

        const search_num = this.state.comic_num;

        // Llama a la funcion fetchComic para realizar la peticion
        this.fetchComic(search_num);

        this.setState({isSubmitted: true});
    }

    comicDisplay() {
        // Si la peticion no esta cargando la solicitud, retorna el componente Comic con el num del comic escrito en el input de search
        if (!this.state.petition.loading){
            return <Comic comic={this.state.comic} />
        }
    }

    fetchComic = async (search_num) => {
        // Declara que la peticion esta cargando la solicitud y que todavia no existe algun error.
        this.setState({ petition: {
            loading: true,
            error: null,
        }});

        // Realiza una peticion a la api con el num de comic escrito en el input.
        try {
            const newSearch = search_num;
            const response = await fetch(`https://cors-anywhere.herokuapp.com/https://xkcd.com/${newSearch}/info.0.json`);
            const data  = await response.json();
    
            // Declara que la peticion finalizó, no hubo ningun error y carga los datos de la peticion a la variable comic.
            this.setState({
                petition: { loading: false, error: null },
                comic: data,
            });
        } catch (error) { // Si existe un error en la peticion, declara que la peticion finalizó y que hubo un error.
            this.setState({
                petition: { loading: false, error: true}, 
            })   
        }

    }
    
    render() {
        // Si existe un error en la peticion, crea un mensaje de error
        if (this.state.petition.error) {
            const error = this.state.petition.error;
            return 'Error: ' + error;
        }

        return (
            <div className="container mx-auto text-center">
                <h1 className="display-1">XKCD</h1>
                <form onSubmit={this.onSubmit} className="">
                    <div className="form-group">
                        <label className="sr-only">Buscar comic por numero: </label>
                        <input type="number"
                            required
                            className="form-control mx-sm-3 mb-2"
                            value={this.state.comic_num}
                            onChange={this.onChangeSearch}
                        />
                        <input type="submit" 
                            className="btn btn-primary mb-2"
                            value="Buscar"
                        />
                    </div>
                </form>
                <div className="container">
                {/* Si la peticion esta cargando, despliega el siguiente componente */}
                    { this.state.petition.loading && (
                        <div className="m-5">
                            <Loader />
                        </div>
                    )}
                
                {/* Si el boton es apretado, despliega la funcion comicDisplay() */}
                    { this.state.isSubmitted && this.comicDisplay() }
                    
                </div>
            </div>
        )
    }
}
