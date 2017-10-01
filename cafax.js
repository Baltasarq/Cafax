// cafax.js
/*
 *      Cafax
 *      (c) baltasarq@gmail.com MIT License
 *
 *      Aventura de texto basada en "El misterio de Aceps",
 *      concretamente en la primera parte. Fue creada originalmente
 *      para Amstrad CPC 6128. Programada por ACE Soft, hubo
 *      un port a MS-DOS escrito en Microsoft QuickBasic.
 *
 *	Generado por fi.js@txtMap, v0.1/v0.52 20140531
 *	31/05/2014 13:08:51
 *
 */

ctrl.ponTitulo( "Cafax" );
ctrl.ponIntro( "<h2>El enigma de Aceps, parte I: Cafax</h2>\
                <p align='justify'>Desde la lejan&iacute;a podemos vislumbrar la majestuosidad \
                de dos de los m&aacute;s grandes monumentos que recorta la luz \
                del Sol: las pir&aacute;mides de Cafax y Aceps. \
                Tormentas de misterio y nubes de terror se esconden en \
                sus entra&ntilde;as. Mientras te acercas a sus dominios un \
                fr&iacute;o helado recorre tu espalda, porque sabes a \
                d&oacute;nde te diriges, pero desconoces lo que te \
                aguarda en su interior.</p>\
                <p>Todo lo que puedes decir es que la carta de Lord \
                Canarvon parece muy alterada, habl&aacute;ndote de \
                extra&ntilde;os sucesos entre los trabajadores.</p>" );
ctrl.ponImg( "res/aceps_presenta.png" );
ctrl.ponAutor( "Baltasarq" );
ctrl.ponVersion( "20160711" );

// *** Locs --

var locAccesoALaTrampa = ctrl.lugares.creaLoc(
    "Acceso a la trampa",
    [ "sala", "estancia" ],
    "Hacia el ${sur, sur} ves algo inquietante... \
        parece una ${trampa, ex trampa} de afilados cuchillos..., al ${norte, norte}, \
        ves la seguridad de la sala alargada."
);
locAccesoALaTrampa.pic = "res/sala_trampa.png";

ctrl.creaObj(
    "trampa",
    [ "acceso", "cuchillos" ],
    "Supones que es el acceso a Aceps. Parece creada para eliminar a los intrusos.",
    locAccesoALaTrampa,
    Ent.Escenario
);

var locAltarDeOfrendas = ctrl.lugares.creaLoc(
    "Altar de ofrendas",
    [ "altar", "ofrendas" ],
    "En el recipiente arde la llama eterna, gracias al aceite en su interior. \
    Dos pasadizos se abren al ${norte, norte} y al ${este, este}."
);
locAltarDeOfrendas.pic = "res/sala_altar_ofrendas.png";

var locAntesala = ctrl.lugares.creaLoc(
    "Antesala",
    [ "sala", "antesala" ],
    "El gran grosor de los muros transmite un fuerte sentimiento \
        de solidez y seguridad. Una breve brecha sobre ti proporciona \
        algo de luz, aunque no puedes identificar su procedencia exacta. \
        La antesala permite el paso hacia ${abajo, baja}, \
        hacia el ${sur, sur}, y hacia el ${este, este}.\
        Un siseo amedrante gu&iacute;a tu mirada hacia una ${serpiente, ex serpiente}."
);
locAntesala.pic = "res/antesala.png";

locAntesala.preGo = function() {
        var dest = locAntesala.devSalida( parser.sentencia.term1 );
        var toret = "";

        if ( dest !== null ) {
                if ( dest !== locEstrechoPasadizo ) {
                        if ( ctrl.personas.devJugador().hayLuz()
                          && ctrl.isPresent( objAntorcha ) )
                        {
                            toret = "Temerosa del fuego, la cobra se mantiene \
                                    alejada. Recuperas el aliento. \
                                    Sin quererlo, lo has \
                                    contenido al pasar por delante de la \
                                    serpiente.";
                            ctrl.goto( dest );
                        } else {
                            toret = "La Cobra intenta abalanzarse sobre ti, \
                                      a&uacute;n mostrando cierto temor a la luz... te echas atr&aacute;s \
                                      y desistes de pasar ante ella.";
                        }
                } else {
                        var s = parser.sentence;

                        s.verb = "ir";
                        s.term1 = "abajo";
                        acciones.devAccion( "go" ).exe( s );
                }
        } else {
                toret = "No se puede ir por ah&iacute;.";
        }

        return toret;
};

var objSerpiente = ctrl.creaObj(
        "serpiente",
    [ "ofidio", "cobra", "animal", "reptil" ],
    "Se trata de una Cobra... tiene extendida su corona y \
        sisea amenazante, mientras se inclina alternativamente \
        hacia los lados. ",
        locAntesala,
        Ent.Escenario
);

objSerpiente.preExamine = function() {
        var toret = objSerpiente.desc;

        if ( ctrl.personas.devJugador().hayLuz() ) {
                toret += "Finalmente, parece perder todo \
                          inter&eacute;s en ti.";
        } else {
                toret += "La serpiente parece retroceder ante \
                          la luz que se cuela del techo, asustada. \
                          Sin embargo, al \
                          mismo tiempo, al verte avanza y hace adem&aacute;n \
                          de atacar.";
        }

        return toret;
};

objSerpiente.preAttack = function() {
    return acciones.ejecuta( "take", "serpiente" );
};

objSerpiente.preTake = function() {
    var toret = "La serpiente casi te muerde al acercar t&uacute; la \
            mano... la has retirado a tiempo... sabes que no habr&iacute;a \
            salvaci&oacute;n, est&aacute;s demasiado lejos de ning&uacute;n \
            m&eacute;dico. Es mejor no tentar a la suerte.";

    if ( ctrl.personas.getPlayer().has( objAntorcha ) ) {
        toret = "La serpiente retrocede violentamente cuando te acercas con \
                 la antorcha, aunque recupera su posici&oacute;n enseguida \
                 cuando retrocedes.";
    }

    return toret;
};

objSerpiente.preTouch = function() {
    return actions.execute( "take", "serpiente" );
};

var locDesierto = ctrl.lugares.creaLoc(
    "Desierto",
    [ "desierto", "arena", "arenas", "sol", "nube", "nubes", "cielo" ],
    "Al ${sur, sur}, entre arenas abrasadoras y un sol implacable, \
        se elevan majestuosos los ${monumentos, ex monumentos} \
        de Cafax y Aceps."
);
locDesierto.luz = true;
locDesierto.pic = "res/desierto.png";

var locDiminutaSala = ctrl.lugares.creaLoc(
    "Diminuta sala",
    [ "sala" ],
    "Un reducido recinto permite avanzar de ${este, este} a ${oeste, oeste}. La altura del techo es la normal, pero en este espacio apenas cabe una persona."
);
locDiminutaSala.pic = "res/sala_peque.png";

var locEntrada = ctrl.lugares.creaLoc(
    "Entrada",
    [ "entrada", "cafax", "monumento", "sepulcro", "escaleras",
          "piramide", "explanada", "playa",
          "arena", "arenas", "sol", "desierto", "nube", "nubes", "cielo" ],
    "Una gran explanada ante la ${entrada, sur} de Cafax sucede al \
        ${desierto, ex desierto}, al ${norte, norte}. Su grandeza te impresiona."
);
locEntrada.luz = true;
locEntrada.pic = "res/cafax.png";

var locEscaleras = ctrl.lugares.creaLoc(
    "Acceso",
    [],
        "Desde el ${desierto, ex desierto} al ${norte, norte}, \
        unas imponentes ${escaleras, ex escaleras} conducen al \
        oscuro interior de ${Cafax, ex cafax}, al ${sur, sur}. \
        Desperdigadas por el suelo, ves un mont&oacute;n de \
        ${herramientas, ex herramientas} que parecen haber sido \
        abandonadas a toda prisa."
);
locEscaleras.luz = true;
locEscaleras.pic = "res/escaleras.png";
locEscaleras.preEnter = function() {
    return actions.execute( "go", "sur" );
};

ctrl.creaObj(
    "desierto",
    [ "desierto", "arena", "arenas", "sol", "nube", "nubes", "cielo" ],
    "El desierto se extiende hacia el ${norte, n}, plet&oacute;rico de arena y sol.",
    locEscaleras,
    Ent.Escenario
);

var objEscaleras = ctrl.creaObj(
    "escaleras",
    [ "escalera", "piramide", "cafax", "columnas", "monumento", "sepulcro" ],
    "La grandiosa escalinata, coronada por portentosas columnas, \
    permite el acceso a Cafax.",
    locEscaleras,
    Ent.Escenario
);

objEscaleras.preEnter = function() {
    return actions.execute( "go", "sur" );
};

var locEstancia = ctrl.lugares.creaLoc(
    "Estancia",
    [ "sala", "estancia" ],
    "Dos ${vasijas policromadas, ex vasijas} flanquean \
    una de las puertas de la estancia, \
    situada al ${sur, sur}, mientras que la otra salida se sit&uacute;a al \
    ${oeste, oeste}."
);
locEstancia.pic = "res/estancia.png";

var objVasijas = ctrl.creaObj(
    "vasijas",
    [ "vasijas", "vasija", "recipente", "recipientes" ],
    "Por la boca de la vasijas, observas que est&aacute;n llenas de trigo. \
     aunque no puedes cogerlo.",
    locEstancia,
    Ent.Escenario
);

objVasijas.preAttack = function() {
    var toret = "";

    if ( objVasijas.has( objTrigo ) ) {
        if ( ctrl.personas.getPlayer().has( objBarra ) ) {
            toret = "Rompes las vasijas, esparciendo el trigo en derredor...";
            objTrigo.moveTo( locEstancia );
            objTrigoFalso.moveTo( ctrl.places.limbo );
            actions.execute( "look" );
            parser.sentence.obj1 = objVasijas;           // "look" sets obj1 to null
        } else {
            toret = "Lo intentas con los pu&ntilde;os y los pies, pero no es \
                     posible romperlas as&iacute;.";
        }
    } else {
        toret = "Ya est&aacute;n hechas pedazos.";
    }

    return toret;
};

objVasijas.preShake = function() {
    return "Por mucho que las sacudes, el trigo no sale, son demasiado pesadas, \
            y sus bocas son demasiado peque&ntilde;as.";
};

objVasijas.prePull = function() {
    return actions.execute( "take", "vasijas" );
};

objVasijas.prePush = function() {
    return actions.execute( "take", "vasijas" );
};

objVasijas.preExamine = function() {
    var toret = objVasijas.desc;

    if ( !( objVasijas.has( objTrigo ) ) ) {
        toret = "Rotas en decenas de pedazos.";
    }

    return toret;
};

objVasijas.preTake = function() {
    var toret = "Son demasiado pesadas.";

    if ( !( objVasijas.has( objTrigo ) ) ) {
        toret = "Solo quedan pedazos de ellas.";
    }

    return toret;
};

var objTrigoFalso = ctrl.creaObj(
    "trigo",
    [ "trigo" ],
    "Por la boca de las vasijas se aprecia negro y podrido.",
    locEstancia,
    Ent.Escenario
);

objTrigoFalso.preTake = function() {
    var toret = "";

    if ( objVasijas.has( objTrigo ) ) {
        toret = "No puedes meter la mano por la boca de ninguna de las vasijas...";
    } else {
        toret = takeAction.exe( parser.sentence );
    }

    return toret;
};


var objTrigo = ctrl.creaObj(
    "trigo",
    [ "trigo" ],
    "Negro y podrido.",
    objVasijas,
    Ent.Portable
);

objTrigo.preDrop = function() {
    var toret = "";

    if ( ctrl.places.getCurrentLoc() == locSalaDeLaMomia ) {
        objTrigo.moveTo( objMesa );
        toret = "Dejas el trigo sobre la mesa.";

        if ( objMesa.has( objTrigo )
          && objMesa.has( objSemillas ) )
        {
            locSalaDeLaMomia.contadorMomia = -1;
        }
    } else {
        toret = dropAction.exe( parser.sentence );
    }

    return toret;
};

var locEstrechoPasadizo = ctrl.lugares.creaLoc(
    "Estrecho pasadizo",
    [ "pasadizo" ],
    "Este estrecho pasadizo comunica el pasillo al ${norte, norte} con una ${zona superior, sube}."
);
locEstrechoPasadizo.pic = "res/pasadizo_estrecho.png";

var locFinalDelCorredor = ctrl.lugares.creaLoc(
    "Final del corredor",
    [ "corredor" ],
    "El final del corredor, que comunica de ${norte, norte} a ${sur, sur}, y \
       tiene una abertura hacia el ${oeste, oeste}, muestra nuevos detalles \
       de grandeza y majestuosidad."
);
locFinalDelCorredor.pic = "res/fin_corredor.png";

var locGranPasaje = ctrl.lugares.creaLoc(
    "Gran pasaje",
    [ "pasaje" ],
    "De esta sala parten pasajes en todas direcciones: \
       ${norte, norte}, ${sur, sur}, ${este, este}, y ${oeste, oeste}. \
       Al ${este, este} y al ${sur, sur}, los pasajes son \
       guardados por sendas ${puertas, ex puertas}."
);
locGranPasaje.pic = "res/gran_pasaje_cerrado.png";

var locGranSala = ctrl.lugares.creaLoc(
    "Gran sala",
    [ "sala", "salas" ],
    "Te sientes insignificante ante la grandeza de las salas, \
      al ${sur, sur} y al ${oeste, oeste}, que se presentan \
       ante tus ojos. Un corredor te llevar&iacute;a hacia \
       ${arriba, arriba}."
);
locGranSala.pic = "res/sala_grandeza.png";

var locLargoCorredor = ctrl.lugares.creaLoc(
    "Largo corredor",
    [ "corredor" ],
    "El largo corredor te adentra en la oscuridad hacia \
        el ${sur, sur}, desde la claridad al ${norte, norte}. \
        Un estrecho pasaje permite el paso al ${este, este}."
);
locLargoCorredor.pic = "res/corredor.png";
locLargoCorredor.doEachTurn = function() {
    var jugador = ctrl.personas.devJugador();

    if ( !( jugador.hayLuz() ) ) {
        ctrl.goto( locEscaleras );
        ctrl.print( "Es demasiada oscuridad, ten&iacute;as que salir." );
    }

    return;
};

var locAnexoAutores = ctrl.lugares.creaLoc(
    "Anexo",
    [ "sala, estancia" ],
    "Una reducida sala, anexa al ${pasillo, oeste}. \
    Puedes ver una rara muestra del ${arte, ex arte} egipcio. \
    Curioso, no has visto nada igual hasta ahora."
);
locAnexoAutores.pic = "res/aceps_autores.png";

ctrl.creaObj(
    "arte",
    [ "imagen", "autores", "autor", "cara", "caras" ],
    "Parecen caras de personas atrapadas en el tiempo...",
    locAnexoAutores,
    Ent.Escenario
);

var locPasadizoBajo = ctrl.lugares.creaLoc(
    "Pasadizo bajo",
    [ "pasadizo" ],
    "Un pasillo bajo y estrecho comunica el corredor al ${este, este} con otra sala al ${sur, sur}."
);
locPasadizoBajo.pic = "res/pasadizo_bajo.png";

var objBanco = ctrl.creaObj(
    "banco",
    [ "bancada", "soporte" ],
    "Hay un banco o soporte en uno de los laterales.",
    locPasadizoBajo,
    Ent.Escenario
);

objBanco.preExamine = function() {
    var toret = objBanco.desc;

    if ( objCuerda.atada ) {
        toret += " Desgraciadamente, el banco est&aacute; del otro lado de \
                 la barra...";
    }

    return toret;
};

var locPasajeDeLosGrabados = ctrl.lugares.creaLoc(
    "Pasaje de los grabados",
    [ "pasaje" ],
    "En este corredor de ${este, este} a ${oeste, oeste}, vestigios de \
     antiguos grabados en la piedra, parecen advertirte de algo."
);
locPasajeDeLosGrabados.pic = "res/pasaje_grabados.png";

var locPasarela = ctrl.lugares.creaLoc(
    "Pasaje",
    [ "sala", "estancia" ],
    "La gran sala permite avanzar de ${este, este} a ${oeste, oeste}, \
     atravesando una ${pasarela, ex pasarela} hecha con cuerdas y madera. \
     El ${abismo, ex abismo} no parece tener fin, es realmente insondable."
);
locPasarela.cruce = null;
locPasarela.pic = "res/sala_pasarela.png";

locPasarela.preGo = function() {
    var s = parser.sentence;
    var weight = ctrl.personas.getPlayer().getWeight();

    if ( s.term1 != locPasarela.cruce ) {
        if ( weight > 1 )
        {
            toret = "Comienzas a cruzar, pero, debido a tu peso, los tablones \
                    empiezan a crujir peligrosamente. Desistes.";
        } else {
            toret = goAction.exe( s );
            toret += "<br>Has cruzado con el alma en vilo... pero ahora \
            s&iacute;, est&aacute;s a salvo.";
        }
    } else {
        toret = goAction.exe( s );
    }

    return toret;
};

ctrl.creaObj(
    "pasarela",
    [ "puente", "colgante" ],
    "El tiempo no la ha tratado demasiado bien. La madera no tiene buen aspecto, si bien las cuerdas parecen aguantar bastante bien.",
    locPasarela,
    Ent.Escenario
);

ctrl.creaObj(
    "abismo",
    [ "insondable", "sima", "oscuridad", "precipicio", "vacio", "caida" ],
    "Uy, miedo me da.",
    locPasarela,
    Ent.Escenario
);

var locPasilloProfundo = ctrl.lugares.creaLoc(
    "Pasillo profundo",
    [ "pasillo" ],
    "Un largo pasillo parte desde el ${norte, norte} para ${descender, abajo} en las profundidades de la oscuridad."
);
locPasilloProfundo.pic = "res/pasillo_profundo.png";

var locPozoDeLasAlmas = ctrl.lugares.creaLoc(
    "Pozo de las almas",
    [ "pozo", "sala", "estancia" ],
     "Este lugar resulta realmente triste y desolado, \
      con altas y estrechas {columnas, ex columnas}, muchas de ellas rotas. \
      Algunos ${pictogramas, ex pictogramas} \
      decoran las paredes. Puedes volver a ${subir, sube} \
      por la ${cuerda, ex cuerda}."
);
locPozoDeLasAlmas.pic = "res/pozo.png";

ctrl.creaObj(
    "cuerda",
    [ "cuerda", "soga" ],
    "La cuerda cuelga hasta tus pies, atada a un poste de sala del sepulcro.",
    locPozoDeLasAlmas,
    Ent.Escenario
);

var objColumnas = ctrl.creaObj(
    "columnas",
    [ "columnas", "columna", "hueco" ],
    "Suben interminables. Hay un hueco en una de ellas.",
    locPozoDeLasAlmas,
    Ent.Escenario
);
objColumnas.ponContenedor( true );

var locRampa = ctrl.lugares.creaLoc(
    "Rampa",
    [ "rampa", "sala", "estancia" ],
    "La pronunciada rampa que asciende hacia el ${sur, sur}, \
     parece haber sido hecha para arrastrar pesados objetos. \
     Otro pasadizo se abre al ${este, este}."
);
locRampa.pic = "res/sala_rampa.png";

var locSalaAlargada = ctrl.lugares.creaLoc(
    "Sala alargada",
    [ "sala", "estancia" ],
    "Las paredes de una alta y alargada sala, comunicando \
     ${norte, norte} y ${sur, sur}, parecen cernirse sobre ti."
);
locSalaAlargada.pic = "res/sala_alargada.png";

var locSalaDeLaLuminaria = ctrl.lugares.creaLoc(
    "Sala de la luminaria",
    [ "sala", "estancia" ],
    "Una gran sala que tiene en el centro de una de sus \
     paredes un ${hueco, ex hueco} \
     que probablemente se usaba para iluminar la estancia. \
     Hay salidas al ${este, este}, ${oeste, oeste}, y al ${sur, sur}."
);
locSalaDeLaLuminaria.pic = "res/sala_luminaria.png";

locSalaDeLaLuminaria.preGo = function() {
    var s = parser.sentence;

    if ( s.term1 == "este" ) {
        locPasarela.cruce = "oeste";
    }

    return goAction.exe( s );
};

ctrl.creaObj(
    "hueco",
    [ "hueco", "luminaria", "brasas", "carboncillos", "carbones",
      "carbon", "brasa", "pared", "paredes" ],
    "Dentro del hueco quedan antiguas brasas y carboncillos.",
    locSalaDeLaLuminaria,
    Ent.Escenario
);

var locSalaDeLaMomia = ctrl.lugares.creaLoc(
    "Sala de la momia",
    [ "sala", "estancia" ],
    "En una tumba en la pared, una \
     ${momia, ex momia} duerme eternamente. \
     En el centro, una desnuda ${mesa de piedra, ex mesa}. \
     La &uacute;nica salida se sit&uacute;a al ${este, este}."
);
locSalaDeLaMomia.pic = "res/sala_momia.png";
locSalaDeLaMomia.contadorMomia = 0;
locSalaDeLaMomia.doEachTurn = function() {
    switch( locSalaDeLaMomia.contadorMomia ) {
    case -1: ctrl.print( "La momia reposa ahora ya en su tumba." );
             --locSalaDeLaMomia.contadorMomia;
             break;
    case 0:
        ctrl.print( "Te ha parecido que ... la momia \
                        abr&iacute;a sus ojos, amenazadora, \
                        y segu&iacute;a tus pasos..." );
        break;
    case 1:
        ctrl.print( "&iexcl;No es una alucinaci&oacute;n! Levanta sus brazos hacia ti..." );
        break;
    case 2:
    default:
        ctrl.print(
                        "\
                                Los horripilantes brazos de la momia \
                                tocan la mesa de piedra... \
                                sus ojos... \
                                sus ojos son insondables, pareciendo transportarte \
                                a un lugar de silencio y muerte... \
                                La momia insiste en la mesa..."
                );
        break;
    }

    ++locSalaDeLaMomia.contadorMomia;
    return;
};

ctrl.creaObj(
    "grabados",
    [ "jerofligico", "grabado", "jeroglificos", "simbolo", "simbolos" ],
    "Los grabados indican que esta momia era el sacerdote mayor \
     del rey Aceps I. Algo en alguno de los grabados te hace deducir \
     que no era muy querido. Es cierto: en uno de ellos se explica que \
     sobre la momia pesa la magia del maldito, y que nunca va a poder \
     merecer el viaje eterno. Menciona algo, adem&aacute;s, sobre unas \
     ofrendas, pero no lo tienes demasiado claro.",
    locSalaDeLaMomia,
    Ent.Escenario
);

var objMesa = ctrl.creaObj(
    "mesa",
    [ "mesado" ],
    "Una mesa de piedra completamente lisa y sin adornos de ning&uacute;n tipo. \
     Tan solo unos grabados en su superficie parecen indicar que se dedica a ofrendas.",
    locSalaDeLaMomia,
    Ent.Escenario
);
objMesa.ponContenedor( true );

var objMomia = ctrl.creaObj(
    "momia",
    [ "momia", "pared", "tumba" ],
    "Te provoca mucho, mucho miedo. Parece quebradiza, \
     a punto de convertirse en polvo, y amenazadora, a un tiempo.",
    locSalaDeLaMomia,
    Ent.Escenario
);

objMomia.ponAlcanzable( false );

objMomia.prePush = function() {
    return "&iexcl;No me acerco ni loco!";
};

objMomia.prePull = function() {
    return actions.execute( "push", "momia" );
};

objMomia.preStart = function() {
    return actions.execute( "push", "momia" );
};

objMomia.preShutdown = function() {
    return actions.execute( "push", "momia" );
};

objMomia.preAttack = function() {
    return "No puedes... el miedo te paraliza.";
};

objMomia.preTalk = function() {
    return "Lo intentas un rato, pero... &iexcl;no atiende a razones!";
};

objMomia.preTake = function() {
    return actions.execute( "push", "momia" );
};

var objLlave = ctrl.creaObj(
    "llave",
    [ "llave" ],
    "Una llave de plata.",
    objMesa,
    Ent.Portable
);

objLlave.preTake = function() {
    var toret = "";

    if ( objMesa.has( objTrigo )
      && objMesa.has( objSemillas ) )
    {
        locSalaDeLaMomia.contadorMomia = -1;
        toret = takeAction.exe( parser.sentence );
    } else {
        toret = "El no muerto lanza un lamento desgarrador y... se&ntilde;ala la mesa...";
    }

    return toret;
};

var locSalaDeLaVidaEterna = ctrl.lugares.creaLoc(
    "Sala de la vida eterna",
    [ "sala", "estancia" ],
    "Animales momificados escoltan a la momia en su eterno viaje. \
    Innumerables grabados te rodean. La estancia solo tiene una entrada desde \
    el ${norte, norte}."
);
locSalaDeLaVidaEterna.pic = "res/sala_funeraria.png";

ctrl.creaObj( "grabados",
    [ "grabados", "jeroglificos", "jerofligico", "grabado" ],
    "El per&iacute;odo de esta pir&aacute;mide te resulta extra&ntilde;amente \
     indeterminado. No eres capaz de descifrar gran cosa de estos grabados.",
    locSalaDeLaVidaEterna,
    Ent.Escenario
);

ctrl.creaObj( "momias",
    [ "animales", "animal", "momia" ],
    "Interesantes las momias de animales de todo tipo a tu alrededor. \
     Extra&ntilde;a creencia la de que incluso tus mascotas te acompa&ntilde;ar&aacute;n \
     en tu vida del m&aacute;s all&aacute;.",
    locSalaDeLaVidaEterna,
    Ent.Escenario
);

var objSemillas = ctrl.creaObj(
    "semillas",
    [ "semillas", "maiz" ],
    "Son semillas de maiz.",
    locSalaDeLaVidaEterna,
    Ent.Portable
);

objSemillas.preDrop = function() {
    var toret = "";

    if ( ctrl.places.getCurrentLoc() == locSalaDeLaMomia ) {
        objSemillas.moveTo( objMesa );
        toret = "Dejas las semillas sobre la mesa.";

        if ( objMesa.has( objTrigo )
          && objMesa.has( objSemillas ) )
        {
            locSalaDeLaMomia.contadorMomia = -1;
        }
    } else {
        toret = dropAction.exe( parser.sentence );
    }

    return toret;
};

var locSalaDeLosVivos = ctrl.lugares.creaLoc(
    "Sala de los vivos",
    [ "sala", "estancia" ],
    "Anubis, dios del reino de los muertos, guarda esta \
    sala de los vivos. Se trata de un recinto cotidiano en \
    los sepulcros de los faraones, en el que se alaba y \
    recrea el goce de la vida, como antesala de la muerte. \
    La estancia discurre de ${norte, norte} a ${sur, sur}."
);
locSalaDeLosVivos.pic = "res/sala_anubis.png";

ctrl.creaObj(
    "anubis",
    [ "dios", "inscripciones", "jeroglificos", "petroglifos" ],
    "Anubis recuerda el goce de la vida.",
    locSalaDeLosVivos,
    Ent.Escenario
);

var locSalaDelAltarDePiedra = ctrl.lugares.creaLoc(
    "Sala del altar de piedra",
    [ "sala", "estancia" ],
    "El suelo se halla encharcado alrededor del ${altar de piedra, ex altar}. \
     Solo se puede volver al ${norte, norte}."
);
locSalaDelAltarDePiedra.pic = "res/sala_altar_piedra.png";

var locSalaDelCofre = ctrl.lugares.creaLoc(
    "Sala del cofre",
    [ "sala", "estancia" ],
    "${Recipientes, ex recipientes} con aceite sagrado iluminan un \
    ${cofre, ex cofre} con muchos grabados. Al ${oeste, oeste}, un gran arco \
    permite el acceso a una sala aparentemente importante. Al ${norte, norte} \
    est&aacute; la salida."
);
locSalaDelCofre.pic = "res/sala_cofre.png";
locSalaDelCofre.preGo = function() {
    var s = parser.sentence;

    if ( s.term1 == "oeste" ) {
        if ( objMesa.has( objLlave ) ) {
            locSalaDeLaMomia.contadorMomia = 0;
        } else {
            locSalaDeLaMomia.contadorMomia = -1;
        }
    }

    return goAction.exe( s );
};

ctrl.creaObj(
    "grabados",
    [ "grabados", "grabado", "jeroglificos", "jerofligico" ],
    "Los grabados no parecen claros, hablan de un brebaje de la virtud que el sacerdote no pudo encontrar.",
    locSalaDelCofre,
    Ent.Escenario
);

ctrl.creaObj(
    "recipientes",
    [ "recipientes", "recipiente", "aceite", "llama", "llamas", "fuego" ],
    "Contienen aceite sagrado, manteniendo una llama sempiterna.",
    locSalaDelCofre,
    Ent.Escenario
);

var objRanura = ctrl.creaObj(
    "ranura",
    [ "hueco", "oquedad" ],
    "Una fina oquedad.",
    locSalaDelCofre,
    Ent.Escenario
);

objRanura.preOpen = function() {
    return actions.execute( "open", "cofre" );
};

objRanura.preAttack = function() {
    return actions.execute( "attack", "cofre" );
};

objRanura.prePush = function() {
    return actions.execute( "push", "cofre" );
};

objRanura.prePull = function() {
    return actions.execute( "pull", "cofre" );
};

objRanura.preStart = function() {
    return actions.execute( "start", "cofre" );
};

var objCofre = ctrl.creaObj(
    "cofre",
    [ "cofre" ],
    "Hecho en piedra y con grabados en su alrededor. En lugar de una \
    cerradura, solo se distingue una fina ${ranura, ex ranura}.",
    locSalaDelCofre,
    Ent.Escenario
);
objCofre.ponContenedor();
objCofre.ponAbierto( false );

objCofre.preExamine = function() {
    var toret = "";

    if ( objCofre.estaAbierto() ) {
        toret += "Est&aacute; abierto, permitiendo ver su interior.<br>";
    }

    toret += examineAction.exe( parser.sentence );
    return toret;
};

objCofre.preClose = function() {
    return "&iexcl;No podr&iacute;as mover la gran tapa de piedra!"
};

objCofre.preOpen = function() {
    var msg = "";
    var player = ctrl.personas.getPlayer();

    if ( player.has( objEspada ) ) {
        msg = "Insertas la espada con cuidado en la ranura... activando alg&uacute;n \
               mecanismo, la tapa de piedra se mueve lentamente... empujas para ayudar \
               en el movimiento, hasta que el cofre queda abierto y puedes ver algo \
               en su interior.";
        objCofre.ponAbierto( true );
    } else {
        msg = "No llevas nada que puedas meter en la fina ranura del cofre.";
    }

    return msg;
};

objCofre.preAttack = function() {
    return "Es in&uacute;til. &iexcl;Es de piedra!";
};

objCofre.prePush = function() {
    return actions.execute( "attack", "cofre" );
};

objCofre.prePull = function() {
    return actions.execute( "attack", "cofre" );
};

objCofre.preStart = function() {
    return actions.execute( "attack", "cofre" );
};

var locSalaDelDiosRey = ctrl.lugares.creaLoc(
    "Sala del dios rey",
    [ "sala", "estancia" ],
    "Esta sala parece completamente dedicada a la vida del rey Aceps I. \
     En la ${imagen, ex imagen}, parece querer ponerse un anillo, \
     pesando sobre su cabeza \
     una espada con... una copa. La sala tiene pasajes al ${norte, norte} y \
     al ${sur, sur}."
);
locSalaDelDiosRey.pic = "res/sala_dios_path.png";

var locSalaDelEspacio = ctrl.lugares.creaLoc(
    "Sala del espacio",
    [ "sala", "estancia" ],
    "Gracias a un boquete en la pared, se aprecia la sala hacia el ${sur, sur}. \
     Es como si se hubiera hecho aposta, ${un ventanal, ex ventanal} para que la imagen \
     del rey, al ${norte, norte}, pudiese contemplar el altar."
);
locSalaDelEspacio.pic = "res/sala_hueco_pared.png";

ctrl.creaObj(
    "hueco",
    [ "espacio", "ventanal", "ventana", "abertura" ],
    "Una abertura por la que se puede ver un altar.",
    locSalaDelEspacio,
    Ent.Escenario
);

var locSalaDelSepulcro = ctrl.lugares.creaLoc(
    "Sala del sepulcro",
    [ "sala", "estancia" ],
    "Un inmenso ${sepulcro de piedra, ex sepulcro}, adornado con numerosos \
     ${pictogramas, ex pictogramas}, se encuentra en el medio de esta gran \
     sala, presidiendo majestuosamente el lugar. \
     La estancia parece como el centro de una \
     encrucijada, hacia el ${sur, sur} y el ${oeste, oeste}. ${Debajo, ex abajo} \
     de esta sala tambi&eacute;n hay algo, aunque no sabr&iacute;as decir qu&eacute; desde aqu&iacute;. Quizás se pueda ${bajar, bajar}."
);
locSalaDelSepulcro.pic = "res/sala_sepulcro.png";

locSalaDelSepulcro.preGo = function() {
    var s = parser.sentence;
    var toret = "";

    if ( s.term1 == "abajo" ) {
        if ( objPoste.has( objCuerda ) )
        {
            toret = "Has descendido por la cuerda, torpemente.";
            toret += goAction.exe( s );
        } else {
            toret = "No puedes descender as&iacute; como as&iacute;... no hay \
                     d&oacute;nde agarrarse.";
        }
    } else {
        if ( s.term1 == "oeste" ) {
            locPasarela.cruce = "este";
        }

        toret += goAction.exe( s );
    }

    return toret;
};

ctrl.creaObj(
    "pozo",
    [ "pozo", "abajo", "negrura", "tinieblas" ],
    "Hacia abajo hay un pozo. A tu lado, sobre el pozo, asoma un ${poste, ex poste}. \
    Solo puedes ver m&aacute;s negrura entre las tinieblas.",
    locSalaDelSepulcro,
    Ent.Escenario
);

var objSepulcro = ctrl.creaObj(
    "sepulcro",
    [ "sepulcro", "mano", "huesos", "tumba", "ataud" ],
    "Excavado en la roca del suelo, realmente parecen haber pasado centurias. \
     Tiene una ${tapa, ex tapa}, tambi&eacute;n de piedra, sobre &eacute;l.",
    locSalaDelSepulcro,
    Ent.Escenario
);
objSepulcro.destapado = false;
objSepulcro.conAnillo = false;

objSepulcro.preExamine = function() {
    var toret = objSepulcro.desc;

    if ( objSepulcro.destapado ) {
        toret += " La tapa desplazada deja a la vista \
                  una mano podrida y huesuda.";
    }

    if ( objSepulcro.conAnillo ) {
        toret += " Has puesto el anillo en uno de los dedos.";
    }

    return toret;
};

var objTapa = ctrl.creaObj(
    "tapa",
    [ "cubierta", "piedra" ],
    "Una gruesa piedra cubre el sepulcro. ",
    locSalaDelSepulcro,
    Ent.Escenario
);

objTapa.prePush = function() {
    var toret = "Desplazas la tapa del sepulcro todo lo que puedes..., \
                 y te detienes, un tanto impresionado por lo que descubres.";

    if ( objSepulcro.destapado ) {
        toret = "No puedes moverla mucho m&aacute;s, y la verdad, tampoco \
                 quieres ver mucho m&aacute;s.";
    } else {
        objSepulcro.destapado = true;
    }

    return toret;
};

objTapa.prePull = function() {
    return "No puedes hacer mucha fuerza as&iacute;. Quiz&aacute;s empujando...";
};

var objAnillo = ctrl.creaObj(
    "anillo",
    [ "anillo" ],
    "Precioso... casi se puede decir que parece... un anillo de compromiso.",
    objColumnas,
    Ent.Portable
);

objAnillo.preDrop = function() {
    var toret = "";
    var s = parser.sentence;
    var loc = ctrl.places.getCurrentLoc();

    if ( s.obj2 != null
      && s.obj2 != objSepulcro )
    {
        toret = "No tiene sentido hacer eso.";
    } else {
        if ( !objSepulcro.tieneAnillo
          && loc == locSalaDelSepulcro
          && objSepulcro.destapado )
        {
            toret = "Sintiendo algo de asco, deslizas el anillo por uno \
                 de los dedos de la momia.";
            objSepulcro.conAnillo = true;
            objAnillo.moveTo( objSepulcro );
        } else {
            toret = "Hecho.";
            objAnillo.moveTo( loc );
        }
    }

    return toret;
};

objAnillo.preTake = function() {
    var toret = "";

    if ( objSepulcro.conAnillo
      && ctrl.places.getCurrentLoc() == locSalaDelSepulcro )
    {
        toret = "Es mejor dejar el anillo donde est&aacute;.";
    } else {
        toret = takeAction.exe( parser.sentence );
    }

    return toret;
};

var locSalaFuneraria = ctrl.lugares.creaLoc(
    "Sala funeraria",
    [ "sala", "estancia" ],
    "En las paredes se aprecian los grabados de un ${papiro, ex papiro}. \
    Solo hay un pasaje al ${norte, norte}."
);
locSalaFuneraria.pic = "res/sala_papiro_funerario.png";

var locTrampa = ctrl.lugares.creaLoc(
    "Sala de comunicaci&oacute;n",
    [ "sala", "estancia" ],
    "Alrededor de la ${salida, ex salida} aparecen \
       ${grabados, ex grabados} de todo tipo. \
       Una abertura de forma oblonga rompe la uniformidad de \
       una de las paredes al ${sur, sur}. Puedes volver al \
       ${norte, norte}."
);
locTrampa.pic = "res/trampa.png";

ctrl.creaObj(
    "trampa",
    [ "abertura", "trampa", "cuchillos", "salida" ],
    "Tiene forma oblonga. Los cuchillos son realmente amenazadores.",
    locTrampa,
    Ent.Escenario
);

ctrl.creaObj(
    "grabados",
    [ "pictogramas", "pictograma", "jerofligico", "jeroglificos",
      "simbolos", "ideograma", "ideogramas" ],
    "Hablan de... castigo y muerte, en el acceso a Aceps.",
    locTrampa,
    Ent.Escenario
);

locTrampa.preGo = function() {
    var player = ctrl.personas.getPlayer();
    var s = parser.sentence;
    var toret = "";

    if ( s.term1 == "sur" ) {
        // Intenta salir
        if ( player.has( objCopa )
          && player.has( objBarra )
          && player.has( objEspada )
          && objSepulcro.conAnillo )
        {
            ctrl.terminaJuego(
                "Colocas la barra de hierro haciendo que dejen de girar \
                 los cuchillos. \
                 Contienes la respiraci&oacute;n mientras pasas por entre las \
                 afiladas hojas, hasta que te internas en un pasaje oscuro, que \
                 desciende m&aacute;s y m&aacute;s en la oscuridad... \
                 <p>&iexcl;Lo has conseguido!</p>\
                 <p>&iexcl;Sigue en el enigma de Aceps 2: Aceps!</p>",
                "res/trampa.png"
            );
        } else {
            toret = "Intuyes que... &iexcl;Todav&iacute;a te faltan cosas!";
        }
    } else {
        toret = goAction.exe( s );
    }

    return toret;
};

// *** Compas --


// -- locAccesoALaTrampa
locAccesoALaTrampa.ponSalida( "norte", locSalaAlargada );
locAccesoALaTrampa.ponSalida( "sur", locTrampa );

// -- locAltarDeOfrendas
locAltarDeOfrendas.ponSalida( "norte", locRampa );
locAltarDeOfrendas.ponSalida( "este", locDiminutaSala );

// -- locAntesala
locAntesala.ponSalida( "sur", locSalaDeLaVidaEterna );
locAntesala.ponSalida( "este", locEstancia );
locAntesala.ponSalida( "abajo", locEstrechoPasadizo );

// -- locDesierto
locDesierto.ponSalida( "sur", locEntrada );

// -- locDiminutaSala
locDiminutaSala.ponSalida( "este", locGranPasaje );
locDiminutaSala.ponSalida( "oeste", locAltarDeOfrendas );

// -- locEntrada
locEntrada.ponSalida( "norte", locDesierto );
locEntrada.ponSalida( "sur", locEscaleras );

// -- locEscaleras
locEscaleras.ponSalida( "norte", locEntrada );
locEscaleras.ponSalida( "sur", locLargoCorredor );

// -- locEstancia
locEstancia.ponSalida( "sur", locSalaDelCofre );
locEstancia.ponSalida( "oeste", locAntesala );

// -- locEstrechoPasadizo
locEstrechoPasadizo.ponSalida( "norte", locFinalDelCorredor );
locEstrechoPasadizo.ponSalida( "arriba", locAntesala );

// -- locFinalDelCorredor
locFinalDelCorredor.ponSalida( "norte", locLargoCorredor );
locFinalDelCorredor.ponSalida( "sur", locEstrechoPasadizo );
locFinalDelCorredor.ponSalida( "oeste", locPasadizoBajo );

// -- locGranPasaje
locGranPasaje.ponSalida( "norte", locGranSala );
locGranPasaje.ponSalida( "oeste", locDiminutaSala );

// -- locGranSala
locGranSala.ponSalida( "sur", locGranPasaje );
locGranSala.ponSalida( "oeste", locPasajeDeLosGrabados );
locGranSala.ponSalida( "arriba", locPasilloProfundo );

// -- locLargoCorredor
locLargoCorredor.ponSalida( "norte", locEscaleras );
locLargoCorredor.ponSalida( "sur", locFinalDelCorredor );
locLargoCorredor.ponSalidaBi( "este", locAnexoAutores );

// -- locPasadizoBajo
locPasadizoBajo.ponSalida( "sur", locPasilloProfundo );
locPasadizoBajo.ponSalida( "este", locFinalDelCorredor );

// -- locPasajeDeLosGrabados
locPasajeDeLosGrabados.ponSalida( "este", locGranSala );
locPasajeDeLosGrabados.ponSalida( "oeste", locRampa );

// -- locPasarela
locPasarela.ponSalida( "este", locSalaDelSepulcro );
locPasarela.ponSalida( "oeste", locSalaDeLaLuminaria );

// -- locPasilloProfundo
locPasilloProfundo.ponSalida( "norte", locPasadizoBajo );
locPasilloProfundo.ponSalida( "abajo", locGranSala );

// -- locPozoDeLasAlmas
locPozoDeLasAlmas.ponSalida( "arriba", locSalaDelSepulcro );

// -- locRampa
locRampa.ponSalida( "sur", locAltarDeOfrendas );
locRampa.ponSalida( "este", locPasajeDeLosGrabados );

// -- locSalaAlargada
locSalaAlargada.ponSalida( "norte", locGranPasaje );
locSalaAlargada.ponSalida( "sur", locAccesoALaTrampa );

// -- locSalaDeLaLuminaria
locSalaDeLaLuminaria.ponSalida( "sur", locSalaDeLosVivos );
locSalaDeLaLuminaria.ponSalida( "este", locPasarela );
locSalaDeLaLuminaria.ponSalida( "oeste", locGranPasaje );

// -- locSalaDeLaMomia
locSalaDeLaMomia.ponSalida( "este", locSalaDelCofre );

// -- locSalaDeLaVidaEterna
locSalaDeLaVidaEterna.ponSalida( "norte", locAntesala );

// -- locSalaDeLosVivos
locSalaDeLosVivos.ponSalida( "norte", locSalaDeLaLuminaria );
locSalaDeLosVivos.ponSalida( "sur", locSalaFuneraria );

// -- locSalaDelAltarDePiedra
locSalaDelAltarDePiedra.ponSalida( "norte", locSalaDelEspacio );

// -- locSalaDelCofre
locSalaDelCofre.ponSalida( "norte", locEstancia );
locSalaDelCofre.ponSalida( "oeste", locSalaDeLaMomia );

// -- locSalaDelDiosRey
locSalaDelDiosRey.ponSalida( "norte", locSalaDelSepulcro );
locSalaDelDiosRey.ponSalida( "sur", locSalaDelEspacio );

// -- locSalaDelEspacio
locSalaDelEspacio.ponSalida( "norte", locSalaDelDiosRey );
locSalaDelEspacio.ponSalida( "sur", locSalaDelAltarDePiedra );

// -- locSalaDelSepulcro
locSalaDelSepulcro.ponSalida( "sur", locSalaDelDiosRey );
locSalaDelSepulcro.ponSalida( "oeste", locPasarela );
locSalaDelSepulcro.ponSalida( "abajo", locPozoDeLasAlmas );

// -- locSalaFuneraria
locSalaFuneraria.ponSalida( "norte", locSalaDeLosVivos );

// -- locTrampa
locTrampa.ponSalida( "norte", locAccesoALaTrampa );


// *** Objs --
ctrl.creaObj(
    "monumentos",
    [ "monumentos", "monumento", "sepulcros", "sepulcro", "cafax",
    "aceps", "piramides", "piramide" ],
    "Se recortan entre las arenas del desierto, hacia el ${sur, sur}.",
    locDesierto,
    Ent.Escenario
);

var objAceite = ctrl.creaObj(
    "aceite",
    [ "aceite" ],
    "Es del tipo que arde.",
    locAltarDeOfrendas,
    Ent.Portable
);

objAceite.preTake = function() {
    var player = ctrl.personas.getPlayer();
    var toret = "";

    if ( player.has( objAntorcha ) ) {
        if ( objAntorcha.conAceite ) {
            toret = "La antorcha ya tiene aceite, no es necesario.";
        } else {
            objAntorcha.conAceite = true;
            toret = "Empapas la antorcha en aceite.";
        }
    } else {
        toret = "No tienes donde llevarlo. No parece pr&aacute;ctico.";
    }

    return toret;
};

var objAltar = ctrl.creaObj(
    "altar",
    [ "altar", "ranura" ],
    "Es un altar de piedra, con varios grabados. Hay una estrecha ranura.",
    locSalaDelAltarDePiedra,
    Ent.Escenario
);
objAltar.ponContenedor( true );

ctrl.creaObj(
    "altar",
    [  ],
    "No puedes verlo bien del todo desde este lugar, pero se adivina de piedra.",
    locSalaDelEspacio,
    Ent.Escenario
);

var objAntorcha = ctrl.creaObj(
    "antorcha",
    [ "antorcha" ],
    "Un tanto vieja, pero puede servir.",
    locPasajeDeLosGrabados,
    Ent.Portable
);

objAntorcha.encendida = false;
objAntorcha.conAceite = false;
objAntorcha.preExamine = function() {
    var toret = objAntorcha.desc;

    if ( objAntorcha.encendida ) {
        toret += " Est&aacute; encendida.";
    } else {
        toret += " Est&aacute; apagada.";
    }

    return toret;
};


objAntorcha.preStart = function() {
    var player = ctrl.personas.getPlayer();
    var toret = "";

    if ( objAntorcha.encendida ) {
        toret = "Pero... &iexcl;Si ya est&aacute; encendida!";
    }

    if ( !objAntorcha.conAceite ) {
        toret = "Necesitas algo para la antorcha que pueda arder.";
    }

    if ( !( player.has( objPedernal ) ) ) {
        toret += "Necesitas algo que pueda hacer una chispa.";
    }

    if ( toret.length == 0 ) {
        objAntorcha.encendida = true;
        objLinterna.encendida = false;
        objLinterna.vacia = true;
        objAntorcha.dec = "Vieja, pero cumpliendo su función.";
        toret = "Enciendes la antorcha. &iexcl;Justo a tiempo! \
                 La luz de la linterna se extingue enseguida.";
    }

    return toret;
};

objAntorcha.preShutdown = function() {
    return "En medio de la oscuridad... no ser&iacute;a una buena idea...";
};

var objBarra = ctrl.creaObj(
    "barra",
    [ "barra" ],
    "De metal, y con gran dureza.",
    locPasadizoBajo,
    Ent.Portable
);

objBarra.desencajada = false;

objBarra.preExamine = function() {
        var toret = objBarra.desc;

        if ( !objBarra.desencajada ) {
                toret += " Est&aacute; encajada en el \
                        &aacute;ngulo que forma el techo con la pared, aunque no \
                        parece estar fijada de ninguna manera. Podr&iacute;as cogerla \
                        de encontrar un modo de subir.";
        }

        return toret;
};

objBarra.takeIt = function() {
    objBarra.moveTo( ctrl.personas.getPlayer() );
    return "Recoges la barra.";
};

objBarra.preTake = function() {
        var toret = "";

        if ( ctrl.lugares.getCurrentLoc() == locPasadizoBajo ) {
            toret = "Demasiado alta. No la alcanzas...";

            if ( ctrl.isPresent( objRoca ) ) {
                if ( !objBarra.desencajada ) {
                    toret = actions.execute( "climb", "roca" );
                } else {
                    toret = objBarra.takeIt();
                }
            }
        } else {
            toret = objBarra.takeIt();
        }

        return toret;
};

var objCopa = ctrl.creaObj(
    "copa",
    [ "copa" ],
    "Se trata de la copa de la virtud, teniendo en cuenta sus grabados.",
    objCofre,
    Ent.Portable
);

var objCuerda = ctrl.creaObj(
    "cuerda",
    [ "cuerda", "soga", "saliente", "extremo", "extremos" ],
    "Una recia cuerda.",
    locRampa,
    Ent.Portable
);

objCuerda.preTie = function() {
    var s = parser.sentence;
    var toret = "";

    if ( s.obj2 == objPoste ) {
        toret = "Atas la cuerda al poste de piedra, y la dejas caer por el pozo.";
        objCuerda.moveTo( objPoste );
    } else {
        toret = tieAction.exe( s );
    }

    return toret;
};

objCuerda.atada = true;
objCuerda.preExamine = function() {
    var toret = objCuerda.desc;

    if ( objCuerda.atada ) {
        toret += " Est&aacute; atada a un saliente de la pared, mediante un lazo simple.";
    }
    else
    if ( objPoste.has( objCuerda ) ) {
        toret += " Est&aacute; fuertemente atada al poste de piedra.";
    }

    return toret;
};

objCuerda.preTake = function() {
    var toret = "";

    if ( objCuerda.atada ) {
        toret = "Est&aacute; atada, no puedes cogerla sin m&aacute;s.";
    } else {
        if ( objPoste.has( objCuerda ) ) {
            toret = "El nudo se ha apretado mucho. No merece la pena.";
        } else {
            toret = takeAction.exe( parser.sentence );
        }
    }

    return toret;
};

objCuerda.prePull = function() {
    var toret = "";

    if ( objCuerda.atada ) {
        objCuerda.atada = false;
        toret = "Liberas la cuerda, que cae al suelo.";
    } else {
        toret = pullAction.exe( parser.sentence );
    }

    return toret;
};

objCuerda.preUntie = function() {
    return actions.execute( "pull", "cuerda" );
};

var objEspada = ctrl.creaObj(
    "espada",
    [ "espada", "hoja", "empunadura" ],
    "Es de metal. ",
    objAltar,
    Ent.Portable
);

objEspada.preTake = function() {
    var toret = "";

    if ( objAltar.has( objEspada ) ) {
        toret = "Tomas la empu&ntilde;adura, y dudando un instante, \
                 tiras de ella hacia arriba... La hoja se desliza \
                 sin esfuerzo.";
        objEspada.moveTo( ctrl.personas.getPlayer() );
    } else {
        toret = takeAction.exe( parser.sentence );
    }

    return toret;
};

objEspada.preExamine = function() {
    var toret = objEspada.desc;

    if ( objAltar.has( objEspada ) ) {
        toret += "La encuentras clavada en el altar.";
    } else {
        toret += "La encuentras ligera y recia al blandirla.";
    }

    return toret;
};

objEspada.preDrop = function() {
    var s = parser.sentence;
    var toret = "";

    if ( ( s.obj2 == objCofre
        || s.obj2 == objRanura )
      && ctrl.places.getCurrentLoc() == locSalaDelCofre )
    {
        toret = actions.execute( "open", "cofre" );
    } else {
        toret = dropAction.exe( s );
    }

    return toret;
};

ctrl.creaObj(
    "pictogramas",
    [ "glifos", "glifo", "pictogramas", "jeroglificos", "pictograma",
      "jeoriglifico", "simbolos", "simbolo" ],
    "Traduces lentamente: \"Mi amada, mi anillo, y el traidor. Haz retornar mi felicidad y el descanso eterno.\" Lo cierto es que parece transmitir un sentimiento de agresiva tristeza.",
    locPozoDeLasAlmas,
    Ent.Escenario
);

ctrl.creaObj(
    "grabados",
    [ "glifos", "jeroglificos", "simbolos", "pictogramas" ],
    "Lees, interesado: \"Y del sacerdocio desciende la espada del traidor, \
     tratando de robar el amor del rey.\"",
    locSalaDelAltarDePiedra,
    Ent.Escenario
);

ctrl.creaObj(
    "agua",
    [ "charco", "encharcado", "suelo", "filtraciones", "filtracion" ],
    "Agua encharcada alrededor del altar... &iquest;Por qu&eacute;,\
     filtraciones en el desierto?",
    locSalaDelAltarDePiedra,
    Ent.Escenario
);

ctrl.creaObj(
    "imagen",
    [ "imagen" ],
    "Parece que el rey desea ponerse un anillo, pero de alguna forma \
    algo se lo impide.",
    locSalaDelDiosRey,
    Ent.Escenario
);

var objLinterna = ctrl.creaObj(
    "linterna",
    [ "linterna", "deposito" ],
    "Es de metal, con un dep&oacute;sito para el aceite.",
    ctrl.lugares.limbo,
    Ent.Portable
);

objLinterna.vacia = false;
objLinterna.encendida = false;
objLinterna.preStart = function() {
        var toret = "Enciendes la linterna.";

        if ( objLinterna.encendida ) {
                toret = "Ya estaba encendida.";
        } else {
                if ( !( objLinterna.vacia ) ) {
                    objLinterna.encendida = true;
                } else {
                    toret = "Parece que se ha quedado sin aceite...";
                }
        }

        return toret;
};

objLinterna.preShutdown = function() {
        var toret = "No, la necesito para iluminar el camino...";

        if ( !objLinterna.encendida ) {
            toret = "Ya est&aacute; apagada.";
        }

        return toret;
};

objLinterna.preExamine = function() {
        var toret = this.desc;

        if ( this.encendida ) {
                toret += " Est&aacute; encendida.";
        } else {
                toret += " Est&aacute; apagada.";
        }

        return toret;
};

objLinterna.preOpen = function() {
    return "Mmmmffff... no puedes... abrirla...";
};

objLinterna.preShake = function() {
    var toret = "Escuchas el movimiento del aceite en el dep&oacute;sito, \
                 aunque no parece que est&eacute; llena.";

    if ( objLinterna.vacia ) {
        toret = "No escuchas nada, la linterna debe haber agotado el aceite.";
    }

    return toret;
};

ctrl.creaObj(
    "papiro",
    [ "papiro" ],
    "Compila antiguos ritos funerarios. Uno de ellos te suena por lo manido: \"La muerte, solo es el principio.\"",
    locSalaFuneraria,
    Ent.Escenario
);

var objPedernal = ctrl.creaObj(
    "pedernal",
    [ "pedernal" ],
    "De poco peso y fuerte tonalidad gris.",
    ctrl.lugares.limbo,
        Ent.Portable
);

ctrl.creaObj(
    "grabados",
    [ "petroglifo", "pegroglifos", "grabado",
      "jeroglificos", "jeroglifico", "simbolos", "simbolo",
      "pictograma", "pictogramas"
    ],
    "Veamos... \"La cola del gran lagarto es vital para vencer con zapatillas de esparto.\" Mmmm... puede que tus conocimientos de los grabados del antiguo egipcio se encuentren oxidados...",
    locPasajeDeLosGrabados,
    Ent.Escenario
);

ctrl.creaObj(
    "pictogramas",
    [ "pictogramas" ],
    "Parece imposible, pero... traduciendo poco a poco los pictogramas, parece ser que en este lugar yace el rey Aceps I. No puede ser...",
    locSalaDelSepulcro,
    Ent.Escenario
);

var objPoste = ctrl.creaObj(
    "poste",
    [ "poste" ],
    "Es un fuerte poste de piedra, sobre el pozo.",
    locSalaDelSepulcro,
    Ent.Escenario
);
objPoste.ponContenedor( true );



ctrl.creaObj(
    "pozo",
    [ "pozo" ],
    "La parte este de esta sala se configura como un ancho pozo, de cuyo fondo ascienden fuertes y delgadas columnas. Nunca ha aparecido algo como esto en tus expediciones, es raro...",
    locSalaDelSepulcro,
    Ent.Escenario
);

var objPuertas = ctrl.creaObj(
    "puertas",
    [ "puertas", "puerta" ],
    "Dos fuertes puertas, al sur y al este. \
         En la esquina entre ambas, una ranura con forma de ${cerrojo, ex cerrojo} \
         se abre en la piedra.",
    locGranPasaje,
    Ent.Escenario
);

objPuertas.preExamine = function() {
        var toret = objPuertas.desc;

        if ( !objCerrojo.estaAbierto() ) {
                toret += " Las puertas bloquean el paso.";
        } else {
                toret += " El paso est&aacute; libre.";
        }

        return toret;
};

objPuertas.preOpen = function() {
        return actions.execute( "open", "cerrojo" );
};

var objCerrojo = ctrl.creaObj(
    "cerrojo",
    [ "ranura", "hueco" ],
    "Un p&eacute;treo hueco en una pared con forma de llave.",
    locGranPasaje,
    Ent.Escenario
);

objCerrojo.ponAbierto( false );

objLlave.preDrop = function() {
        var toret = "Meter la llave en eso no va a lograr nada.";

        if ( parser.sentence.obj2 === objCerrojo ) {
                toret = actions.execute( "open", "cerrojo" );
        }

        return toret;
};

objCerrojo.preOpen = function() {
        var player = ctrl.personas.getPlayer();
        var toret = "No ha ocurrido nada.";
        var s = parser.sentence;

        // Llave especificada?
        if ( s.obj2 === null ) {
                s.obj2 = objLlave;
        }

        // Abrir el cerrojo
        if ( objCerrojo.estaAbierto() ) {
                toret = "Pero... ¡si ya est&aacute; abierto!";
        }
        else
        if ( s.obj2 !== objLlave
         && !player.has( s.obj2 ) )
        {
                toret = "No llevas eso contigo.";
        }
        else
        if ( s.obj2 === objLlave
         && !player.has( s.obj2 ) )
        {
                toret = "Necesitas algo para abrir el cerrojo.";
        } else {
                // Â¿Es la llave o no?
                if ( s.obj2 !== objLlave ) {
                        toret = "Meter eso en el cerrojo no va a lograr nada.";
                } else {
                        toret = "Con el coraz&oacute;n palpitante, \
                                 introduces la llave en la ranura. \
                                 Al intentar girarla, notas como algo \
                                 se atasca, y haces fuerza. Con \
                                 un sonoro crujido, la llave se \
                                 rompe y desaparece por la ranura,  \
                                 mientras las puertas se deslizan \
                                 hacia arriba, hasta desbloquear \
                                 el paso.";
                        objCerrojo.ponAbierto();
                        objLlave.moveTo();
                        locGranPasaje.ponSalida( "sur", locSalaAlargada );
                        locGranPasaje.ponSalida( "este", locSalaDeLaLuminaria );
                        locGranPasaje.pic = "res/gran_pasaje_abierto.png";
                        actions.execute( "look" );
                }
        }

        return toret;
};

var objRecipiente = ctrl.creaObj(
    "recipiente",
    [ "recipiente" ],
    "En el recipiente encuentras el aceite sagrado.",
    locAltarDeOfrendas,
    Ent.Escenario
);

var objSandalia = ctrl.creaObj(
    "sandalia",
    [ "sandalia" ],
    "Una sandalia media podrida.",
    locSalaFuneraria,
    Ent.Portable
);

var objTabla = ctrl.creaObj(
    "tabla",
    [ "tabla" ],
    "Madera podrida por el tiempo.",
    locDiminutaSala,
    Ent.Portable
);

var objTumba = ctrl.creaObj(
    "tumba",
    [ "tumba" ],
    "Dentro de la tumba, se encuentra una momia con atuendo de sacerdote.",
    locSalaDeLaMomia,
    Ent.Escenario
);

var objHerramientas = ctrl.creaObj(
        "herramientas",
        [ "herramientas", "utiles", "instrumentos",
          "pico", "picos", "pala", "palas" ],
        "Un mont&oacute;n de herramientas de todo tipo: picos, palas...",
        locEscaleras,
        Ent.Escenario
);

objHerramientas.vecesExaminado = 0;
objHerramientas.preExamine = function() {
    var toret = objHerramientas.desc;

    ++objHerramientas.vecesExaminado;

    if ( objHerramientas.vecesExaminado > 2 ) {
        toret = actions.execute( "search", "herramientas" )
    } else {
        toret += " cuanto m&aacute;s rebuscas, m&aacute;s cosas van apareciendo, pero nada de inter&eacute;s por ahora...";
    }

    return toret;
};

objHerramientas.preSearch = function() {
        var toret = "No encuentras nada m&aacute;s que merezca la pena.";

        if ( objLinterna.owner === ctrl.lugares.limbo ) {
                objLinterna.moveTo( locEscaleras );
                objPedernal.moveTo( locEscaleras );

                ctrl.lugares.actualizaDesc();
                toret = "Apartando lo in&uacute;til, descubres una \
                         ${linterna, coge linterna } y un ${ pedernal, \
                         coge pedernal}.";
        }

        return toret;
};

var objRoca = ctrl.creaObj(
        "roca",
        [ "roca", "piedra" ],
        "Una roca de buen tama&ntilde;o.",
        locLargoCorredor,
        Ent.Portable
);

objRoca.preClimb = function() {
        var player = ctrl.personas.getPlayer();
        var toret = "Te subes, pero despu&eacute;s de un rato, \
                     te sientes un tanto est&uacute;pido y te \
                     vuelves a bajar.";

        if ( locPasadizoBajo.has( objRoca )
          && !( objBarra.desencajada ) )
        {
                toret = "Subes a la roca, coges la barra y vuelves a bajar.";
                objBarra.moveTo( player );
                objBarra.desencajada = true;
                actions.execute( "look" );
        }

        return toret;
};

objRoca.preTake = function() {
        return "Pesa demasiado, apenas pudiste levantarla \
                unos cent&iacute;metros, aunque probando a empujarla, \
                comprobaste que puedes moverla a&uacute;n con \
                bastante esfuerzo.";
};

objRoca.prePull = function() {
        return "No puedes, pesa demasiado. S&iacute; que puedes empujarla \
                aprovechando tu cuerpo para aplicar m&aacute;s \
                fuerza."
};

objRoca.prePush = function() {
        var toret = "La empujaste con todas tus fuerzas... ";
        var loc = ctrl.places.getCurrentLoc();
        var dir = parser.sentence.term2;

        if ( dir === null ) {
                dir = "sur";
                if ( loc == locFinalDelCorredor ) {
                    dir = "oeste";
                }
        }

        var dest = loc.getExit( dir );

        if ( dest != null ) {
                if ( loc == locLargoCorredor
                  && dest != locFinalDelCorredor )
                {
                       toret += "un escal&oacute;n hace imposible \
                                sacar la roca de la pir&aacute;mide.";
                }
                else
                if ( loc == locFinalDelCorredor
                  && dest != locPasadizoBajo
                  && dest != locLargoCorredor )
                {
                        toret += "pero las irregularidades \
                                  del suelo aqu&iacute;­ hacen imposible \
                                  moverla en esa direcci&oacute;n.";

                } else {
                        objRoca.moveTo( dest );
                        actions.execute( "look" );
                        toret += "y conseguiste desplazarla al " + dir + ".";
                }
        } else {
                toret = "La pared te lo impide.";
        }

        return toret;
};

// --- Jugador ---------------------------------------------------------
var jugador = ctrl.personas.creaPersona( "Howard Carter",
                    [ "howard", "carter", "explorador" ],
                    "Howard Carter, un Arque&oacute;logo experto en el mundo egipcio.",
                    locDesierto
);

jugador.hayLuz = function() {
        return ( ( ctrl.isPresent( objAntorcha ) && objAntorcha.encendida )
              || ( ctrl.isPresent( objLinterna ) && objLinterna.encendida ) );
};

jugador.preAction = function() {
    var toret = "";

    if ( parser.sentence.act == dropAction
      && ctrl.lugares.getCurrentLoc() == locPasarela )
    {
        toret = "No hay espacio donde dejar nada por aqu&iacute;.";
    }

    return toret;
};

jugador.postAction = function() {
    var loc = ctrl.lugares.getCurrentLoc();

    if ( !( jugador.hayLuz() )
      && loc != locAnexoAutores
      && loc != locDesierto
      && loc != locEntrada
      && loc != locEscaleras
      && loc != locLargoCorredor
      && loc != locFinalDelCorredor )
    {
        ctrl.terminaJuego(
            "Oscuridad... no puedes ver nada... tropiezas en la \
             negrura... ahora ya solo es cuestión de tiempo..., oh, por Dios...\
             no hay esperanza para m&iacute;...",
             "res/cafax.png"
        );
    }
};

jugador.getWeight = function(player) {
    if ( arguments.length == 0 ) {
        player = ctrl.personas.getPlayer();
    }

    var objs = player.objs;
    var toret = objs.length;

    for(var i = 0; i < objs.length; ++i) {
        var obj = objs[ i ];

        if ( obj == objCarta
          || obj == objAnillo
          || obj == objAntorcha
          || obj == objBrujula )
        {
            --toret;
        }
    }

    return toret;
};

var objCarta = ctrl.creaObj(
        "carta",
        [ "carta", "manuscrito", "misiva" ],
        "<p align='justify'>Querido Se&ntilde;or Carter:<br/><br/>\
        Deseo que se encuentre ud. bien. Le escribo con motivo de las \
        reci&eacute;n descubiertas pir&aacute;mides de Cafax y Aceps. Como le \
        relat&eacute; en otra ocasi&oacute;n, sospecho que el primer sepulcro \
        es la puerta de acceso al segundo, aunque desde que empezaron a \
        trabajar mis hombres todo han sido dificultades. Han informado \
        de serpientes que guardan c&aacute;maras inaccesibles, \
        extra&ntilde;os altares y puertas bloqueadas.<br/>\
        La situaci&oacute;n ha llegado hasta tal punto que los hombres \
        no se atreven a trabajar m&aacute;s en Cafax.<br/> \
        Sin embargo, es primordial encontrar la entrada a la \
        pir&aacute;mide de Aceps, y &eacute;sta debe encontrarse, lo presiento, \ en el interior de Cafax.<br/>\
        Mi buen amigo, pongo la situaci&oacute;n en sus manos, sabedor \
        de que su gran experiencia y buen hacer sabr&aacute;n solventar \
        este desagradable entuerto.<br/><br/>\
        Suyo afect&iacute;simo,<br/><br/>\
        Lord Carnarvon.</p>",
        jugador,
        Ent.Portable
);

var objBrujula = ctrl.creaObj(
    "br&uacute;jula",
    [ "compas", "brujula" ],
    "Tu fiable br&uacute;jula.",
    jugador,
    Ent.Portable
);

objBrujula.preDrop = function() {
        return "No puedes hacer eso: necesitas orientarte.";
};

objBrujula.preExamine = function() {
        var loc = ctrl.lugares.devLocActual();
        return objBrujula.desc + " " + actions.getAction( "exits" ).exe();
};

// Arranque ------------------------------------------------------------
ctrl.personas.cambiaJugador( jugador );
ctrl.lugares.ponInicio( locDesierto );

ctrl.ponAlarma( 55, function() {
    ctrl.ponAlarma( 40, function() {
        if ( ctrl.isPresent( objLinterna )
          && !objLinterna.vacia
          && objLinterna.encendida )
        {
            ctrl.print( "La llama de la linterna se apaga definitivamente." );
            objLinterna.encendida = false;
            objLinterna.vacia = true;
        }
    });

    if ( ctrl.isPresent( objLinterna )
      && !objLinterna.vacia
      && objLinterna.encendida )
    {
        ctrl.print( "La llama de la linterna tiembla varias veces... \
            ¡la linterna se queda sin combustible!... Parece que \
            a&uacute;n aguanta, pero..." );
    }
});
