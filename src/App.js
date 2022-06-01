import React, { Component } from 'react';
import axios from 'axios';
import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
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
        book: '',
        fecha_prestamo: '',
        fecha_devolucion: '',
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
    <table border="1" class="table table-light table-striped">
      <thead>
        <tr>
          <td>Libro</td>
          <td>Cliente</td>
          <td>Inicio</td>
          <td>Fin</td>
          <td>Acciones</td>
        </tr>
      </thead>
      <tbody>
        {this.state.prestamos.map((prestamo, index) => {
          return (
            <tr key={prestamo.id}>
              <td>{prestamo.usuario}</td>
              <td>{prestamo.libro}</td>
              <td>{prestamo.f_prestamo}</td>
              <td>{prestamo.f_devolucion}</td>
              <td>
                <button type="button" class="btn btn-success m-2" onClick={() => this.mostrar(prestamo.id, index)}>Editar</button>
                <button type="button" class="btn btn-danger m-2"  onClick={() => this.eliminar(prestamo.id)}><img src="https://cdn-icons.flaticon.com/png/512/3687/premium/3687412.png?token=exp=1654100915~hmac=ba39a37e258d516dfc7e0256afc25e63" height="23px" width="23px"/></button>
              </td>
            </tr>
            

          )
        })}
      </tbody>
    </table>
    <hr/>
    <div className="container">
      <h1>{this.state.titulo}</h1>
      <form onSubmit={this.guardar} className="row g-2 needs-validation">
        <input type="hidden" value="{this.state.id}"/>
          <div class="col-md-4">
            <label for="validationCustom01" class="form-label">Libro</label>
            <input type="number" class="form-control" id="validationCustom01" value={this.state.book} onChange={this.cambioBook} required/>
          </div>
          <div class="col-md-4">
            <label for="validationCustom01" class="form-label">Usuario</label>
            <input type="number" class="form-control" id="validationCustom01" value={this.state.user} onChange={this.cambioUser} required/>
          </div>
          <div class="col-md-4">
            <label for="validationCustom01" class="form-label">Inicio</label>
            <input type="date" pattern="\d{4}-\d{2}-\d{2}" class="form-control" id="validationCustom01" value={this.state.fecha_devolucion} onChange={this.cambioFechaDevolucion} required/>
          </div>
          <div class="col-md-4">
            <label for="validationCustom01" class="form-label">Devolucion</label>
            <input type="date" pattern="\d{4}-\d{2}-\d{2}" class="form-control" id="validationCustom01" value={this.state.fecha_prestamo} onChange={this.cambioFechaPrestamo} required/>
          </div>
        <p><input type="submit"></input></p>

      </form>
      </div>
  </div>)
}
}
export default App;
