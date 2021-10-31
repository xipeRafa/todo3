ID("all").addEventListener("click", ()=> instFilters.filter() )
ID("removeComplited").addEventListener("click", ()=> instFilters.cleanCompleted() )
ID("active").addEventListener("click", ()=> instFilters.filter('toggle', true) )
ID("completed").addEventListener("click", ()=> instFilters.filter('toggle', false) )

const inputText = document.querySelector('#inputTextId');

const form = document.querySelector('#form')

form.addEventListener('submit', newCita); //82

let editMode = false;

const citaObj = {
    inputTextName: '',
    toggle:false
}

eventListeners();
function eventListeners(){ inputText.addEventListener('change', setData) }
function setData(e){ citaObj[e.target.name] = e.target.value; }

class Citas {
    constructor() {
        this.citas = [];
    }
    
    addCita(cita) { this.citas = [...this.citas, cita]; console.log('line 28', this.citas); instFilters.cantActive() } 
    /*addCita(cita) { this.citas.unshift(cita) } */

    toggleItem(toggle) { this.citas.map( cita => cita.id === toggle ? cita.toggle = !cita.toggle : cita);
                         instFilters.cantActive() }

    editCita(update) { this.citas = this.citas.map( cita => cita.id === update.id ? update : cita )}

    deleteCita(id) { this.citas = this.citas.filter( cita => cita.id !== id); instFilters.cantActive() }

    search(key, value) {
            let copy = [...this.citas] 
    
            typeof value === 'string' 
               ? this.citas = this.citas.filter(cita => cita[key].indexOf(value) > -1, console.log('search'))  
               : this.citas = this.citas.filter((cita)=> cita[key] !== value );

            setTimeout(() => { this.citas = copy }, 10 )  
    }
    
    completed(){ 
        this.citas = this.citas.filter( cita => cita.toggle === false )
        instLS.addToLocalStorage()
    };

    cant(){
        const Active = this.citas.filter(cita => cita.toggle === false)
        let cant = ID('citasActive'); 
        cant.innerHTML = `<p>Items Active: ${ Active.length } </p>`
    }

    addToLocalStorage(){
      localStorage.setItem('todos', JSON.stringify(this.citas));
      console.log('siii')  
    }
    
    getFromLocalStorage(){
      const reference = localStorage.getItem('todos');
      if (reference) {
        this.citas = JSON.parse(reference);
        console.log('fromLS:', JSON.parse(reference))
      }  
    }
 
}

const instCitas = new Citas();

function newCita(e) {
    e.preventDefault();

    const {inputTextName} = citaObj;

    if( inputTextName === '' ) { return ui.printAlert('Type something first pleace', 'error') }

    if(editMode) {
        instCitas.editCita( {...citaObj} );
        ui.printAlert('Edited Correctly');
        form.querySelector('button[type="submit"]').textContent = 'Create';
        editMode = false;
    } else {
        citaObj.id = Date.now();
        instCitas.addCita({...citaObj});
        ui.printAlert('Added successfully')
    }

    ui.printCitas(instCitas);
    reiniciarObjeto() 
    form.reset();
    instLS.addToLocalStorage()
}

function reiniciarObjeto() { citaObj.inputTextName = '' , citaObj.toggle = false }
 
function deleteCita(id) {
    instCitas.deleteCita(id);
    ui.printCitas(instCitas) //reload UI
    instLS.addToLocalStorage()
}

function cargarEdicion(cita) {
    const {inputTextName, toggle, id } = cita;

    citaObj.inputTextName = inputTextName;
    citaObj.toggle = toggle;
    citaObj.id = id;

    inputText.value = inputTextName;
    inputText.focus()
    form.querySelector('button[type="submit"]').textContent = 'save edit';

    editMode = true;
    console.log(cita)
}

function toggleChange(id){
   instCitas.toggleItem(id)
   ui.printCitas(instCitas) // reload UI
}


class UI {

    printAlert(mensaje, tipo) {

        const divAlert = document.createElement('div');
        divAlert.classList.add('divAlert');
        divAlert.textContent = mensaje;

        tipo === 'error' ? divAlert.classList.add('alert') : divAlert.classList.add('success')

        document.querySelector('#alerts').appendChild( divAlert ); 

        setTimeout( () => { divAlert.remove()}, 3000)   
    }

   printCitas({citas}) { // Se puede aplicar destructuring desde la función...
       
        this.cleanHTML();

        citas.forEach(cita => {
            const {inputTextName, toggle, id } = cita;

            const divCita = document.createElement('div');
            divCita.classList.add('divCita');
            divCita.dataset.id = id;

            const textHeader2 = document.createElement('h2');
            textHeader2.classList.add('card-title');
            textHeader2.innerHTML = `${inputTextName}`;

            const btnDelete = document.createElement('button');
            btnDelete.onclick = () => deleteCita(id); 
            btnDelete.classList.add('btn-danger');
            btnDelete.innerHTML = 'Delete'

            const btnEdit = document.createElement('button');
            btnEdit.onclick = () => cargarEdicion(cita); 
            btnEdit.classList.add('btn-edit');
            btnEdit.innerHTML = 'Edit'

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.classList.add('toggle');
            checkbox.id = id;
            checkbox.name = 'toggle';
            checkbox.value = toggle; 
            checkbox.onclick = () => toggleChange(id);
         
            const label = document.createElement('label')
            label.htmlFor = id;
            label.appendChild(document.createTextNode('Completed'));
         
            document.createElement('br');
         
            divCita.appendChild(checkbox);
            divCita.appendChild(label);
            divCita.appendChild(textHeader2)
            divCita.appendChild(btnDelete)
            divCita.appendChild(btnEdit)

            list.appendChild(divCita);

            if(toggle){
                let container = ID(id).parentElement;
                container.classList.add('completedToggle') 

                let label = ID(id).nextElementSibling; 
                label.classList.add('label')
            } 
        })  
    }

    cleanHTML(){ 
        while(list.firstChild) { 
            list.removeChild(list.firstChild)
        }
    }
}



const ui = new UI();

class Filters {

        filter(key, val){ 
            if(key){ 
                instCitas.search(key, val); ui.printCitas(instCitas)
            }else{
                ui.printCitas(instCitas); console.log('All')
            }
        }  

        cleanCompleted(){ instCitas.completed(); ui.printCitas(instCitas) }   
        
        cantActive(){instCitas.cant()}
}

const instFilters = new Filters(); 

window.addEventListener("load", function(event) {
    instLS.getFromLocalStorage();
    instFilters.cantActive()
  });

class LS {
  addToLocalStorage(){
    instCitas.addToLocalStorage();
  } 

  getFromLocalStorage(){
    instCitas.getFromLocalStorage()
    ui.printCitas(instCitas)
  }
  
}
const instLS = new LS()

