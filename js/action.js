
var expresion;
var accion;
var valores = new Array();
var resultado;

var log1 = [], log2 = [], log3 = [];

if (!String.contains) {
    String.prototype.contains = function (e) {
        return this.indexOf(e) >= 0;
    }
}

function nuevoArbol(e) {

    document.getElementById("txtResultado").value = "";

    log1 = [], log2 = [], log3 = []
    
    var expresion = document.getElementById("txtExpresion").value;
    var nodos = Arbol.crear(expresion);
    window.actualesNodos = nodos[0];

    accion = e.getAttribute("data-name");

    switch (accion) {
        case "preorden": Recorrido.preorden(actualesNodos, log1); resultado = log1.toString();break;
        case "postorden": Recorrido.postorden(actualesNodos, log2); resultado = log2.toString(); break;
        case "inorden": Recorrido.inorden(actualesNodos, log3); resultado = log3.toString(); break;        
    }

    resultado = resultado.replace(/,/g,"");
    document.getElementById("txtResultado").value = resultado;

}


var Recorrido = {
    /* Izquierdo, Derecho, Raíz */
    preorden: function (nodo, log) {
        var simbolos = "+-*/()^";
        if (nodo == null) { return }
        if (nodo.children) {
            this.preorden(nodo.children[0], log);
            this.preorden(nodo.children[1], log);
        }
        !isNaN(nodo.label) ? log.push(nodo.label) : simbolos.contains(nodo.label) ? log.push(nodo.label) : log.push(nodo);
    },
    /* Raíz, Izquierdo, Derecho */
    postorden: function (nodo, log) {
        var simbolos = "+-*/()^";
        if (nodo == null) { return }
        !isNaN(nodo.label) ? log.push(nodo.label) : simbolos.contains(nodo.label) ? log.push(nodo.label) : log.push(nodo);
        if (!nodo.children) { return }
        
        this.postorden(nodo.children[0], log); //Subárbol izquierdo
        this.postorden(nodo.children[1], log); //Subárbol derecho        
    },
    /* Izquierdo, Raíz, Derecho */
    inorden: function (nodo, log) {
        var simbolos = "+-*/()^";
        if (nodo == null){ return; }

        if (nodo.children) {
            this.inorden(nodo.children[0], log);
        }
        !isNaN(nodo.label) ? log.push(nodo.label) : simbolos.contains(nodo.label) ? log.push(nodo.label) : log.push(nodo);
        if (nodo.children) {
            this.inorden(nodo.children[1], log);
        }
    }
}

var Arbol = {

    crear: function (expresion) {
        var posfija = Parcer.aPosFija(expresion);

        var posfija = posfija.split(" ");

        //Pilas
        var E = posfija.reverse(); //Pila entrada
        var P = []; //Pila de operandos
        
        //Evaluación Postfija
        var operadores = "+-*/%^";
        while (E.length > 0) {
            //si es un operador
            if (operadores.contains(E[E.length - 1])) {
                P.push(this.crearNodo(E.pop(), P.pop(), P.pop()));
            } else {
                P.push(E.pop());
            }
        }

        //retorna nodos
        return P;
    },
    getInfo: function (v) {
        //es un digito
        if (!isNaN(v)) {
            return {
                label: v
            }
        }
        //es resultado de una operacion
        return v;
    },
    crearNodo: function (operador, n2, n1) {
        return {
            label: operador,
            expanded: true,
            children: [this.getInfo(n1), this.getInfo(n2),]
        };
    }
};

var Parcer = {

    operadores: {
        '^': 5,
        '*': 4,
        '/': 4,
        '+': 3,
        '-': 3,
        ')': 2,
        '(': 1,
        obtenerPrecedencia: function () {

        }
    },

    /*Depura la expresion algebraica, quita espacios en blanco y deja un espacio entre peradores y dijitos*/
    prepararexpresion: function (expresion) {
        var simbolos = "+-*/()^";
        var salida = "";
        expresion = expresion.replace(/\\s+/, '');
        expresion = "(" + expresion + ")";
        for (var i = 0; i < expresion.length; i++) {
            if (simbolos.contains(expresion.charAt(i))) {
                salida += " " + expresion.charAt(i) + " ";
            } else {
                salida += expresion.charAt(i);
            }

        }
        return salida.trim();
    },
    /*Determina la jerarquia de operadores*/
    jerarquia: function (operador) {
        if (this.operadores[operador]) {
            return this.operadores[operador];
        }
        //si no es un operador tiene mayor precedencia
        return 99;
    },
    aPosFija: function (expresion) {
        expresion = this.prepararexpresion(expresion);
        var infija = expresion.split(" ");

        var E = infija.reverse(), // Entrada
            P = [], // Temporal
            S = []; //salida

        while (E.length > 0) {

            // E[E.length - 1] extrae el ultimo valor de la pilla  .peek();
            switch (this.jerarquia(E[E.length - 1])) {
            case 1:
                P.push(E.pop());
                break;
            case 2:
                while (P[P.length - 1] != "(") {
                    S.push(P.pop())
                }
                P.pop();
                E.pop();
                break;
            case 3:
            case 4:
            case 5:
                while (this.jerarquia(P[P.length - 1]) >= this.jerarquia(E[E.length - 1])) {
                    S.push(P.pop());
                }
                P.push(E.pop());
                break;
            default:
                S.push(E.pop());
            }
        }
        //quita las comas y coloca espacio
        return S.join(" ").replace(/\s{2,}/g, ' ').trim();
        
    }


};

var info = (function() {
    alert("Desarrollador : Diego Armando Payán López \nSeptimo Semestre \nTecnologico de Culiacán");
});