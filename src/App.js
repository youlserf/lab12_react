import React, { Component } from 'react';
import axios from 'axios';
import logo from './logo.svg';
import './App.css';
class App extends Component {
  constructor(props) {
    super(props);
    this.state = ({
      prestamos:[],
      pos: null,
      titulo: 'nuevo',
      id: 0,
      user: '',
      book:'',
      fecha_prestamo: '',
      fecha_devolucion: '',
      
    })

    this.cambioUser = this.cambioUser.bind(this);
    this.cambioBook = this.cambioBook.bind(this);
    this.cambioFechaPrestamo = this.cambioFechaPrestamo.bind(this);
    this.cambioFechaDevolucion = this.cambioFechaDevolucion.bind(this);
    this.mostrar = this.mostrar.bind(this);
    this.eliminar = this.eliminar.bind(this);
    this.guardar = this.guardar.bind(this);
  }

  componentWillMount() {
    axios.get('http://localhost:8000/biblioteca/prestamos')
      .then(res => {
        this.setState({
          prestamos: res.data
        })
      })
  }

  cambioUser(e) {
    this.setState({
      user: e.target.value
    })
  }

  cambioBook(e) {
    this.setState({
      book: e.target.value
    })
  }
  
  cambioFechaPrestamo(e) {
    this.setState({
      fecha_prestamo: e.target.value
    })
  }
  cambioFechaDevolucion(e) {
    this.setState({
      fecha_devolucion: e.target.value
    })
  }

 
  innerjoin(){
    
  }
  mostrar(cod, index) {
    axios.get('http://localhost:8000/biblioteca/prestamos/'+cod+'')
    .then(res => {
      this.setState({
        pos: index,
        titulo: 'Editar',
        id: res.data.id,
        user: res.data.usuario,
        book: res.data.libro,
        fecha_prestamo: res.data.f_prestamo,
        fecha_devolucion: res.data.f_devolucion,
      })
    })
  }

  guardar(e){
    e.preventDefault();
    let cod = this.state.id;
    let datos = {
      usuario: this.state.user,
      libro: this.state.book,
      f_prestamo: this.state.fecha_prestamo,
      f_devolucion: this.state.fecha_devolucion,
    }
    if (cod > 0){//editamos registro
      axios.put('http://localhost:8000/biblioteca/prestamos/' + cod + '/', datos)
        .then(res => {
          let indx = this.state.pos;
          this.state.prestamos[indx] = res.data;
          var temp = this.state.prestamos;
          this.setState({
            pos: null,
            titulo: 'Nuevo',
            id: 0,
            user: '',
            book: '',
            fecha_prestamo: '',
            fecha_devolucion: '',
            prestamos: temp
          })
    }).catch(error => {
      console.log(error);
    })
  }else{//Nuevo registro
    axios.post('http://localhost:8000/biblioteca/prestamos/', datos)
    .then(res => {
      this.state.prestamos.push(res.data);
      var temp = this.state.prestamos;
      this.setState({
        id: 0,
        user: '',
        fecha_prestamo: '',
        rating: 0,
        categoria: '',
        prestamos : temp
      })
    }).catch(error => {
      console.log(error);
    })
  }
  }

  eliminar(cod){
    let rpta = window.confirm('¿Esta seguro de eliminar el registro?');
    if(rpta){
      axios.delete('http://localhost:8000/biblioteca/prestamos/'+cod+'/')
      .then(res => {
        var temp = this.state.prestamos.filter((prestamo)=>prestamo.id !== cod)
        this.setState({
          prestamos: temp
      })
    })
  }
}

render() {
  return (
  <div>
    <h1>Lista de prestamos</h1>
    <table border="1">
      <thead>
        <tr>
          <td>user</td>
          <td>fecha_prestamo</td>
          <td>Rating</td>
          <td>Categoria</td>
          <td>Acciones</td>
        </tr>
      </thead>
      <tbody>
        {this.state.prestamos.map((prestamo, index) => {
          return (
            <tr key={prestamo.id}>
              <td>{prestamo.usuario}</td>
              <td>
                <button onClick={() => this.mostrar(prestamo.id, index)}>Editar</button>
                <button onClick={() => this.eliminar(prestamo.id)}>Eliminar</button>
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
      
  </div>)
}
}
export default App;
