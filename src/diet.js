  /* ---------- grupos SMAE (valores por 1 equivalente) ---------- */
  var G={
    V:{n:"Verduras",s:"Verdura",c:"--c-v",k:25,p:2,l:0,h:4},
    F:{n:"Frutas",s:"Fruta",c:"--c-f",k:60,p:0,l:0,h:15},
    C:{n:"Cereales sin grasa",s:"Cereal",c:"--c-c",k:70,p:2,l:0,h:15},
    CG:{n:"Cereales con grasa",s:"Cereal c/grasa",c:"--c-c",k:115,p:2,l:5,h:15},
    LG:{n:"Leguminosas",s:"Leguminosa",c:"--c-lg",k:120,p:8,l:1,h:20},
    MB:{n:"AOA muy bajo en grasa",s:"AOA muy bajo",c:"--c-a",k:40,p:7,l:1,h:0},
    AB:{n:"AOA bajo en grasa",s:"AOA bajo",c:"--c-a",k:55,p:7,l:3,h:0},
    L:{n:"Leche descremada",s:"Leche",c:"--c-l",k:95,p:9,l:2,h:12},
    G:{n:"Aceites sin proteína",s:"Grasa",c:"--c-g",k:45,p:0,l:5,h:0},
    GP:{n:"Aceites con proteína",s:"Grasa c/proteína",c:"--c-g",k:70,p:3,l:5,h:3},
    AZ:{n:"Azúcares sin grasa",s:"Azúcar",c:"--c-az",k:40,p:0,l:0,h:10}
  };
  var DS=[["V",4],["F",5],["C",17],["LG",2],["MB",5],["AB",3],["L",2],["G",6],["GP",3],["AZ",2]];
  var T={
    des:{n:"Desayuno",eq:[["L",2],["F",2],["C",2],["GP",2],["AZ",1]],kcal:630,p:28},
    col:{n:"Colación",eq:[["CG",2],["MB",2],["LG",1],["F",1]],kcal:490,p:26},
    com:{n:"Comida",eq:[["C",6],["AB",3],["LG",1],["V",2],["G",2]],kcal:845,p:45},
    pre:{n:"Pre-entreno",eq:[["F",2],["C",2],["GP",1],["AZ",1]],kcal:370,p:7},
    cen:{n:"Cena",eq:[["C",5],["MB",3],["V",2],["G",2]],kcal:610,p:35}
  };
  var ORDER=["des","col","com","pre","cen"];
  ORDER.forEach(function(k){var t=T[k];t.l=0;t.h=0;t.eq.forEach(function(e){t.l+=G[e[0]].l*e[1];t.h+=G[e[0]].h*e[1];});});
  function mac(t){return t.kcal+' kcal · '+t.p+' g P · '+t.h+' g HCO · '+t.l+' g LIP';}

  /* opciones que no cambian entre menús */
  var DES_B={t:"Sin licuadora",d:"2 rebanadas de pan integral con 4 cditas de crema de cacahuate, 1 plátano en rodajas y 2 cditas de miel, más 2 tazas de leche (o 2 cajitas de 250 ml)."};
  var COL_B={t:"Tacos de atún para llevar",d:"2 tortillas de harina chicas con ½ lata de atún en agua (≈ 60 g), ½ taza de frijoles untados y salsa, más ½ plátano."};
  var PRE=[{t:"Sándwich de plátano y cacahuate",d:"2 rebanadas de pan integral, 2 cditas de crema de cacahuate, 1 plátano en rodajas y 2 cditas de miel."},
           {t:"Versión para llevar",d:"1 plátano, 14 cacahuates y 1 bolillo sin migajón con 2 cditas de mermelada."}];
  var DOM={gym:"Descanso · día de batch",
    com:{t:"Comida familiar",d:"Una palma grande de carne o pollo, 1½ tazas de arroz o 2 papas con 2 tortillas, frijoles y verduras cocidas. Pide sin aguacate."},
    cen:{t:"Porción de reserva o lo que sobre",d:"Una porción de reserva del congelador, o 75 g de pollo con 1 taza de arroz, 1 tortilla y verduras."}};
  var WED_BASE="Pasa al refri lo que se come el jueves. Cocina 1½ tazas de arroz crudo para jueves a sábado (o usa el congelado) y ";

  /* ---------- los 4 menús ---------- */
  var MENUS=[
  {n:"Chili y caldo",short:"Chili con carne, caldo de pollo, pollo deshebrado",
   des:{t:"Licuado de plátano y cacahuate",d:"2 tazas de leche descremada o deslactosada light, 1 plátano, 40 g de avena (4 cdas copeteadas), 4 cditas de crema de cacahuate (20 g) y 2 cditas de miel. Licúa y llévatelo en termo si vas tarde."},
   col:{t:"Enfrijoladas con queso panela",d:"2 tortillas de maíz pasadas por el comal con 2 cditas de aceite, bañadas en ½ taza de frijoles licuados con un poco de su caldo, rellenas o cubiertas con 80 g de queso panela en tiras, más ½ plátano o 1 manzana. Arma el tupper en la mañana con los frijoles del batch; 1–2 min en microondas.",tip:"Mismas porciones que el burrito: las 2 tortillas de maíz con aceite equivalen a la tortilla de harina grande, y el panela sustituye al pollo como origen animal (80 g = 2 AOA de bajo aporte de grasa, unos 4 g más de grasa en total). Sin refri, cómelas antes de 4 horas."},
   days:{
    lun:{com:{t:"Caldo de pollo con frijoles de la olla",d:"1 plato hondo: 1 pierna con muslo sin piel (≈ 90 g de carne), 1 papa y 1 taza de zanahoria, calabacita y chayote. Aparte ½ taza de frijoles de la olla, ½ taza de arroz y 2 tortillas."},
         cen:{t:"Tacos de pollo deshebrado",d:"75 g de pollo en 5 tortillas de maíz, 1 taza de calabacita y cebolla salteadas en 2 cditas de aceite, salsa roja."}},
    mar:{com:{t:"Chili con carne con arroz",d:"1½ tazas de chili (≈ 90 g de res, ½ taza de frijol, jitomate, pimiento y cebolla), 1 taza de arroz y 2 tortillas. Aguanta bien en el tupper."},
         cen:{t:"Pollo con papas de air fryer",d:"75 g de pollo deshebrado, 2 papas en gajos del batch, 1 tortilla y 1 taza de verduras congeladas con 2 cditas de aceite."}},
    mie:{com:{t:"Caldo de pollo con frijoles de la olla",d:"La segunda porción del domingo: caldo con pierna, papa y verduras. Aparte ½ taza de frijoles, ½ taza de arroz y 2 tortillas."},
         cen:{t:"Croquetas de atún con papa y mozzarella",d:"Machaca 2 papas cocidas con ⅔ de lata de atún escurrido (≈ 90 g), 30 g de queso mozzarella rallado, cebolla picada, sal y pimienta. Forma 4–5 croquetas y dóralas en sartén con 1 cdita de aceite o en air fryer a 200 °C por 12 min. Con 1 tortilla y 1 taza de verduras cocidas.",tip:"Mismos equivalentes que antes: el mozzarella cuenta como 1 AOA y trae su propia grasa, por eso solo va 1 cdita de aceite. La papa amarra la croqueta sin necesidad de huevo."}},
    jue:{com:{t:"Papas rellenas de chili",d:"2 papas cocidas abiertas y cubiertas con 1½ tazas de chili, más 2 tortillas. Llévalo en termo de comida si puedes."},
         cen:{t:"Bowl de pollo y arroz",d:"1 taza de arroz, 75 g de pollo deshebrado, 1 taza de verduras congeladas salteadas en 2 cditas de aceite, salsa y 1 tortilla."}},
    vie:{com:{t:"Arroz con pollo a la sartén",d:"90 g de pechuga cruda en cubos, 1½ tazas de arroz ya cocido, 1 taza de verduras congeladas, 2 cditas de aceite y salsa de soya. Al lado ½ taza de frijoles. 15 minutos."},
         cen:{t:"Croquetas de atún con papa y mozzarella",d:"Machaca 2 papas cocidas con ⅔ de lata de atún escurrido (≈ 90 g), 30 g de queso mozzarella rallado, cebolla picada, sal y pimienta. Forma 4–5 croquetas y dóralas en sartén con 1 cdita de aceite o en air fryer a 200 °C por 12 min. Con 1 tortilla y 1 taza de verduras cocidas.",tip:"Mismos equivalentes que antes: el mozzarella cuenta como 1 AOA y trae su propia grasa, por eso solo va 1 cdita de aceite. La papa amarra la croqueta sin necesidad de huevo."}},
    sab:{com:{t:"Chili con carne con arroz",d:"La porción congelada del domingo: 1½ tazas de chili, 1 taza de arroz y 2 tortillas."},
         cen:{t:"Lomo de cerdo a la plancha",d:"90 g de lomo crudo (o pechuga) a la plancha, 2 papas, 1 tortilla y 1 taza de verduras salteadas en 2 cditas de aceite."}}},
   steps:[
    ["0:00","Frijoles a la olla exprés.","750 g de frijol seco lavado, 3 L de agua, ½ cebolla, 2 ajos y sal. 40–45 min desde que suena, sin remojar. Si no quieres, compra 6 bolsas de frijoles cocidos."],
    ["0:05","Pollo para deshebrar.","400 g de pechuga en agua con cebolla, ajo, laurel y sal. 25 min a hervor suave. Guarda el caldo."],
    ["0:10","Caldo de pollo.","En la olla grande: 4 piernas con muslo sin piel, 2 zanahorias, 2 calabacitas, 1 chayote, 4 papas en trozos, 1 chipotle de lata, ajo, cebolla y sal. 40 min."],
    ["0:15","Arroz.","2 tazas de arroz crudo (≈ 6 tazas cocidas) con 4 tazas de agua o caldo y 2 cditas de aceite. 20 min tapado y 5 de reposo."],
    ["0:25","Chili con carne.","1 cda de aceite, 1 cebolla, 2 pimientos y 3 ajos picados. Agrega 500 g de res molida 90/10 y dora 8 min. Añade 1 lata de jitomate triturado (800 g), 2 cdas de chile en polvo o 2 guajillos licuados, 1 cdita de comino, orégano, sal y 2½ tazas de los frijoles. 25 min a fuego bajo. Salen 5 porciones de 1½ tazas."],
    ["0:40","Papas.","2 papas en gajos con 1 cdita de aceite, sal y paprika para el martes. Air fryer 200 °C 22 min u horno 220 °C 35 min."],
    ["0:55","Deshebra el pollo y aparta los frijoles de las enfrijoladas.","Licúa 3 tazas de frijoles con un poco de su caldo y guárdalos en 6 porciones de ½ taza. Corta el panela en 6 porciones de 80 g."],
    ["1:15","Porciona.","Pesa una vez con báscula para aprender el tamaño a ojo. Enfría el arroz extendido en un refractario y refrigéralo antes de 1 hora."],
    ["1:30","Listo.","Lava la olla exprés y ya."]],
   store:[["Chili con carne · 5 porciones","1 (martes)","4 (jueves, sábado y 2 de reserva)"],
          ["Caldo de pollo · 4 porciones","2 (lunes y miércoles)","2 de reserva"],
          ["Pollo deshebrado · ≈ 225 g","150 g (cenas de lunes y martes)","75 g (cena del jueves)"],
          ["Frijoles licuados y panela · 6 porciones","3 (lunes a miércoles)","3 frijoles (pásalos al refri la noche anterior); el panela va en refri"],
          ["Arroz · ≈ 6 tazas","3 tazas","El resto, en bolsas de 1 taza"],
          ["Frijoles","2 tazas","El resto, en bolsas de ½ taza"]],
   wed:"cuece 6 papas en el microondas (8–10 min, picadas con tenedor) para jueves, viernes y sábado.",
   shop:[
    ["Proteína",["Pechuga de pollo sin piel, 500 g","Queso panela, 500 g","Pierna con muslo sin piel, 4 piezas","Res molida 90/10, 500 g","Lomo de cerdo, 100 g (o más pechuga)","Atún en agua, 4 latas (2 de reserva)","Queso mozzarella, 100 g"]],
    ["Cereales y tubérculos",["Arroz, 1 kg","Papa mediana, 2 kg (≈ 12)","Tortilla de maíz, 1.5 kg","Tortillas de harina chicas, 1 paquete","Pan de caja integral, 1 paquete","Avena en hojuela, 300 g"]],
    ["Leguminosas",["Frijol seco, 750 g (o 6 bolsas cocidos)"]],
    ["Leche y fruta",["Leche descremada o deslactosada light, 4 L","Plátanos, 16 (mitad verdes, mitad maduros)","Manzanas, 3","Café (opcional)"]],
    ["Verduras",["Zanahoria, 4","Calabacita, 4","Chayote, 1","Cebolla, 3","Jitomate, 4","Jitomate triturado, 1 lata de 800 g","Pimiento, 2","Ejotes, 250 g","Verduras mixtas congeladas, 2 bolsas","Ajo, limones, cilantro"]],
    ["Grasas, azúcares y sazón",["Crema de cacahuate natural, 1 frasco","Cacahuates naturales, 1 bolsa","Aceite de canola u oliva","Miel o mermelada","Chile en polvo o guajillo, comino, orégano, paprika","Chipotle en lata, salsa de soya, salsa roja sin aguacate"]]]},

  {n:"Tinga y picadillo",short:"Tinga de pollo, picadillo de res con papa, arroz rojo, frijoles de la olla",
   des:{t:"Licuado de plátano, cocoa y canela",d:"2 tazas de leche descremada, 1 plátano, 40 g de avena, 4 cditas de crema de cacahuate, 2 cditas de miel, 1 cda de cocoa sin azúcar y canela al gusto."},
   col:{t:"Burrito de tinga y frijol",d:"1 burrito del batch (tortilla de harina grande, 50 g de tinga escurrida, ½ taza de frijoles machacados) y ½ plátano o 1 manzana.",tip:"Escurre bien la tinga al armarlo para que la tortilla no se moje."},
   days:{
    lun:{com:{t:"Picadillo de res con papa",d:"1½ tazas de picadillo (≈ 90 g de res, 1 papa, zanahoria y calabacita), ½ taza de arroz rojo, ½ taza de frijoles de la olla y 2 tortillas."},
         cen:{t:"Tacos de tinga",d:"75 g de tinga de pollo en 5 tortillas de maíz. La cebolla y el jitomate de la tinga cuentan como verdura; 2 cditas de aceite para calentar las tortillas."}},
    mar:{com:{t:"Arroz rojo con tinga y frijoles",d:"1 taza de arroz rojo, 90 g de tinga, ½ taza de frijoles y 2 tortillas. Seco y fácil de llevar al hospital."},
         cen:{t:"Papas con tinga",d:"2 papas en gajos del batch, 75 g de tinga, 1 tortilla y 1 taza de verduras congeladas con 2 cditas de aceite."}},
    mie:{com:{t:"Picadillo de res con papa",d:"La segunda porción: picadillo, ½ taza de arroz rojo, ½ taza de frijoles y 2 tortillas."},
         cen:{t:"Croquetas de atún con papa y mozzarella",d:"Machaca 2 papas cocidas con ⅔ de lata de atún escurrido (≈ 90 g), 30 g de queso mozzarella rallado, cebolla picada, sal y pimienta. Forma 4–5 croquetas y dóralas en sartén con 1 cdita de aceite o en air fryer a 200 °C por 12 min. Con 1 tortilla y 1 taza de verduras cocidas.",tip:"Mismos equivalentes que antes: el mozzarella cuenta como 1 AOA y trae su propia grasa, por eso solo va 1 cdita de aceite. La papa amarra la croqueta sin necesidad de huevo."}},
    jue:{com:{t:"Bowl de tinga",d:"1 taza de arroz rojo, 90 g de tinga, ½ taza de frijoles, 2 tortillas y salsa."},
         cen:{t:"Sopa de fideo con pollo",d:"1 taza de fideo cocido en caldo de jitomate (15 min), 75 g de tinga o pollo, 1 taza de calabacita y zanahoria, 2 cditas de aceite y 3 tortillas."}},
    vie:{com:{t:"Bistec a la mexicana",d:"90 g de bistec de res guisado con jitomate, cebolla y chile en 2 cditas de aceite, 1 taza de arroz, ½ taza de frijoles y 2 tortillas. 15 minutos."},
         cen:{t:"Croquetas de atún con papa y mozzarella",d:"Machaca 2 papas cocidas con ⅔ de lata de atún escurrido (≈ 90 g), 30 g de queso mozzarella rallado, cebolla picada, sal y pimienta. Forma 4–5 croquetas y dóralas en sartén con 1 cdita de aceite o en air fryer a 200 °C por 12 min. Con 1 tortilla y 1 taza de verduras cocidas.",tip:"Mismos equivalentes que antes: el mozzarella cuenta como 1 AOA y trae su propia grasa, por eso solo va 1 cdita de aceite. La papa amarra la croqueta sin necesidad de huevo."}},
    sab:{com:{t:"Picadillo de res con papa",d:"La porción congelada: picadillo, ½ taza de arroz, ½ taza de frijoles y 2 tortillas."},
         cen:{t:"Pollo a la plancha con papas",d:"90 g de pechuga cruda a la plancha, 2 papas, 1 tortilla y 1 taza de verduras salteadas en 2 cditas de aceite."}}},
   steps:[
    ["0:00","Frijoles de la olla.","500 g de frijol seco en olla exprés con 2 L de agua, ½ cebolla, ajo y sal. 40–45 min."],
    ["0:05","Pollo para la tinga.","1 kg de pechuga en agua con cebolla, ajo y sal. 25 min. Guarda 4 tazas del caldo para el arroz."],
    ["0:10","Picadillo.","1 cda de aceite, cebolla y ajo; dora 500 g de res molida 90/10 por 8 min. Agrega 3 papas y 3 zanahorias en cubos chicos, 2 calabacitas, 2 jitomates licuados, comino y sal. 20 min tapado. Salen 5 porciones."],
    ["0:30","Arroz rojo.","Licúa 2 jitomates, ¼ de cebolla y 1 ajo con las 4 tazas de caldo. Sofríe 2 tazas de arroz en 1 cda de aceite por 3 min, agrega lo licuado y cocina 20 min tapado."],
    ["0:35","Tinga.","Acitrona 2 cebollas en rajas en 1 cda de aceite. Licúa 4 jitomates con 2 chipotles de lata y agrégalos; 10 min. Deshebra el pollo y mézclalo."],
    ["0:45","Papas.","2 papas en gajos con 1 cdita de aceite para el martes. Air fryer 200 °C 22 min."],
    ["0:55","Arma 6 burritos.","Tortilla de harina grande, ½ taza de frijoles machacados y 50 g de tinga escurrida. Envuelve en aluminio y congela."],
    ["1:15","Porciona y enfría.","Arroz extendido en refractario y al refri antes de 1 hora."],
    ["1:30","Listo.",""]],
   store:[["Picadillo · 5 porciones","2 (lunes y miércoles)","3 (sábado y 2 de reserva)"],
          ["Tinga · ≈ 400 g libres","Cena del lunes, comida y cena del martes","Comida y cena del jueves"],
          ["Burritos de tinga · 6","Pasa uno al refri cada noche","6"],
          ["Arroz rojo · ≈ 6 tazas","3 tazas","El resto, en bolsas de 1 taza"],
          ["Frijoles de la olla","3 tazas","El resto, en bolsas de ½ taza"]],
   wed:"cuece 2 papas en el microondas para el sábado. El jueves en la noche cuece el fideo (15 min).",
   shop:[
    ["Proteína",["Pechuga de pollo sin piel, 1.1 kg","Res molida 90/10, 500 g","Bistec de res, 100 g","Atún en agua, 4 latas (2 de reserva)","Queso mozzarella, 100 g"]],
    ["Cereales y tubérculos",["Arroz, 1 kg","Papa mediana, 2 kg (incluye las de las croquetas)","Tortilla de maíz, 1 kg","Tortillas de harina grandes, 1 paquete","Tortillas de harina chicas, 1 paquete","Pan de caja integral, 1 paquete","Avena en hojuela, 300 g","Fideo, 1 paquete"]],
    ["Leguminosas",["Frijol seco, 500 g (o 4 bolsas cocidos)"]],
    ["Leche y fruta",["Leche descremada o deslactosada light, 4 L","Plátanos, 16","Manzanas, 3","Cocoa sin azúcar y canela","Café (opcional)"]],
    ["Verduras",["Jitomate, 12","Cebolla, 5","Zanahoria, 5","Calabacita, 5","Verduras mixtas congeladas, 2 bolsas","Ajo, chiles, limones"]],
    ["Grasas, azúcares y sazón",["Crema de cacahuate natural (si se acabó)","Cacahuates naturales","Aceite de canola u oliva","Miel o mermelada","Chipotle en lata, comino, salsa roja sin aguacate"]]]},

  {n:"Albóndigas y salsa verde",short:"Albóndigas en chipotle, pollo en salsa verde, lentejas, arroz blanco",
   des:{t:"Licuado de mango y plátano",d:"2 tazas de leche descremada, ½ plátano, ½ mango, 40 g de avena, 4 cditas de crema de cacahuate y 2 cditas de miel. Si no hay mango, 1 plátano entero."},
   col:{t:"Burrito de pollo en salsa verde",d:"1 burrito del batch (tortilla de harina grande, 50 g de pollo en salsa verde bien escurrido, ½ taza de frijoles refritos) y ½ plátano o 1 manzana.",tip:"Salsa verde de tomate verde, sin aguacate."},
   days:{
    lun:{com:{t:"Albóndigas en chipotle",d:"4 albóndigas (≈ 90 g de res) en su salsa con zanahoria y calabacita, 1 taza de arroz, ½ taza de lentejas y 2 tortillas."},
         cen:{t:"Pollo en salsa verde con papas",d:"75 g de pollo en salsa verde, 2 papas en gajos con 2 cditas de aceite y 1 tortilla. La salsa de tomate verde cuenta como verdura."}},
    mar:{com:{t:"Pollo en salsa verde con arroz",d:"90 g de pollo en salsa verde, 1 taza de arroz, ½ taza de lentejas y 2 tortillas."},
         cen:{t:"Croquetas de atún con papa y mozzarella",d:"Machaca 2 papas cocidas con ⅔ de lata de atún escurrido (≈ 90 g), 30 g de queso mozzarella rallado, cebolla picada, sal y pimienta. Forma 4–5 croquetas y dóralas en sartén con 1 cdita de aceite o en air fryer a 200 °C por 12 min. Con 1 tortilla y 1 taza de verduras cocidas.",tip:"Mismos equivalentes que antes: el mozzarella cuenta como 1 AOA y trae su propia grasa, por eso solo va 1 cdita de aceite. La papa amarra la croqueta sin necesidad de huevo."}},
    mie:{com:{t:"Albóndigas en chipotle",d:"La segunda porción: 4 albóndigas en salsa, 1 taza de arroz, ½ taza de lentejas y 2 tortillas."},
         cen:{t:"Tacos de pollo en salsa verde",d:"75 g de pollo escurrido en 5 tortillas con cebolla y cilantro, y 2 cditas de aceite."}},
    jue:{com:{t:"Pollo en salsa verde con papas",d:"90 g de pollo en salsa verde, 2 papas, 2 tortillas y ½ taza de lentejas."},
         cen:{t:"Croquetas de atún con papa y mozzarella",d:"Machaca 2 papas cocidas con ⅔ de lata de atún escurrido (≈ 90 g), 30 g de queso mozzarella rallado, cebolla picada, sal y pimienta. Forma 4–5 croquetas y dóralas en sartén con 1 cdita de aceite o en air fryer a 200 °C por 12 min. Con 1 tortilla y 1 taza de verduras cocidas.",tip:"Mismos equivalentes que antes: el mozzarella cuenta como 1 AOA y trae su propia grasa, por eso solo va 1 cdita de aceite. La papa amarra la croqueta sin necesidad de huevo."}},
    vie:{com:{t:"Fajitas de pollo",d:"90 g de pechuga en tiras con pimiento y cebolla salteados en 2 cditas de aceite, 1 taza de arroz, ½ taza de lentejas o frijoles y 2 tortillas. 15 minutos."},
         cen:{t:"Albóndigas en chipotle",d:"La porción congelada: 4 albóndigas en salsa con 1 taza de arroz y 1 tortilla."}},
    sab:{com:{t:"Bistec asado con nopales",d:"90 g de bistec de res asado con cebollitas y nopales asados, 1 taza de arroz, ½ taza de lentejas o frijoles y 2 tortillas. Con salsa roja."},
         cen:{t:"Pollo en salsa verde con papas",d:"La porción congelada: 75 g de pollo, 2 papas y 1 tortilla."}}},
   steps:[
    ["0:00","Lentejas.","500 g de lentejas lavadas con 1.5 L de agua, ajo, ¼ de cebolla, 1 jitomate y sal. 25 min en olla normal, sin remojar. Salen ≈ 6 tazas."],
    ["0:05","Salsa verde.","Hierve 1 kg de tomate verde, 2–3 serranos y ½ cebolla por 10 min. Licúa con ajo, cilantro y sal."],
    ["0:10","Arroz blanco.","2 tazas de arroz crudo con 4 tazas de agua y 2 cditas de aceite. 20 min tapado y 5 de reposo."],
    ["0:15","Albóndigas.","Mezcla 500 g de res molida 90/10 con 3 cdas de avena, ajo, comino y sal (o 1 huevo: va mezclado en toda la carne). Haz 20 bolitas. Licúa 4 jitomates con 2 chipotles, hiérvelo con 1 zanahoria y 1 calabacita picadas y cuece ahí las albóndigas 25 min. Salen 5 porciones de 4."],
    ["0:30","Pollo en salsa verde.","Dora 1 kg de pechuga en cubos en 1 cda de aceite, agrega la salsa verde y cocina 15 min."],
    ["0:45","Papas.","2 papas en gajos con 1 cdita de aceite para el lunes. Air fryer 200 °C 22 min."],
    ["0:55","Arma 6 burritos.","Tortilla de harina grande, ½ taza de frijoles refritos de bolsa y 50 g de pollo en salsa verde bien escurrido. Aluminio y al congelador."],
    ["1:15","Porciona y enfría.","Arroz extendido y al refri antes de 1 hora."],
    ["1:30","Listo.",""]],
   store:[["Albóndigas · 5 porciones","2 (lunes y miércoles)","3 (cena del viernes y 2 de reserva)"],
          ["Pollo en salsa verde · ≈ 400 g libres","Cena del lunes, comida del martes, cena del miércoles","Comida del jueves, cena del sábado"],
          ["Burritos · 6","Pasa uno al refri cada noche","6"],
          ["Lentejas · ≈ 6 tazas","3 tazas","El resto, en bolsas de ½ taza"],
          ["Arroz · ≈ 6 tazas","3 tazas","El resto, en bolsas de 1 taza"]],
   wed:"cuece 4 papas en el microondas para el jueves y el sábado.",
   shop:[
    ["Proteína",["Pechuga de pollo sin piel, 1.1 kg","Res molida 90/10, 500 g","Bistec de res, 100 g","Atún en agua, 4 latas (2 de reserva)","Queso mozzarella, 100 g"]],
    ["Cereales y tubérculos",["Arroz, 1 kg","Papa mediana, 2 kg (incluye las de las croquetas)","Tortilla de maíz, 1 kg","Tortillas de harina grandes, 1 paquete","Tortillas de harina chicas, 1 paquete","Pan de caja integral, 1 paquete","Avena en hojuela, 350 g (incluye la de las albóndigas)"]],
    ["Leguminosas",["Lentejas, 500 g","Frijoles refritos, 1 bolsa (para los burritos)"]],
    ["Leche y fruta",["Leche descremada o deslactosada light, 4 L","Plátanos, 12","Mangos, 4","Manzanas, 3","Café (opcional)"]],
    ["Verduras",["Tomate verde, 1 kg","Chile serrano, 4","Cilantro, 1 manojo","Jitomate, 8","Cebolla, 4","Zanahoria, 2","Calabacita, 2","Pimiento, 2","Nopales, 3 piezas","Cebollitas cambray, 1 manojo","Verduras mixtas congeladas, 1 bolsa"]],
    ["Grasas, azúcares y sazón",["Crema de cacahuate natural (si se acabó)","Cacahuates naturales","Aceite de canola u oliva","Miel o mermelada","Chipotle en lata, comino, salsa roja sin aguacate"]]]},

  {n:"Caldo de res y pollo al horno",short:"Caldo de res, pollo al horno, arroz verde, frijoles charros",
   des:{t:"Frappé de café con plátano",d:"2 tazas de leche descremada fría, 1 shot de café o 1 cdita de café soluble, 1 plátano congelado, 40 g de avena, 4 cditas de crema de cacahuate y 2 cditas de miel. Desayuno y café en uno."},
   col:{t:"Burrito de pollo al horno y charros",d:"1 burrito del batch (tortilla de harina grande, 50 g de pollo al horno picado, ½ taza de frijoles charros escurridos y machacados) y ½ plátano o 1 manzana."},
   days:{
    lun:{com:{t:"Caldo de res",d:"1 plato hondo: ≈ 90 g de res magra, 1 papa, zanahoria, calabacita, chayote y ejote. Aparte ½ taza de arroz verde, ½ taza de frijoles charros y 2 tortillas."},
         cen:{t:"Pollo al horno con papas",d:"75 g de pollo al horno, 2 papas en gajos, 1 tortilla y 1 taza de verduras congeladas con 2 cditas de aceite."}},
    mar:{com:{t:"Arroz verde con pollo al horno",d:"1 taza de arroz verde, 90 g de pollo al horno, ½ taza de frijoles charros, 1 taza de calabacitas y 2 tortillas."},
         cen:{t:"Tacos de pollo al horno",d:"75 g de pollo picado en 5 tortillas con cebolla, cilantro y salsa roja, más 1 taza de verduras salteadas en 2 cditas de aceite."}},
    mie:{com:{t:"Caldo de res",d:"La segunda porción: caldo con res, papa y verduras, ½ taza de arroz verde, ½ taza de charros y 2 tortillas."},
         cen:{t:"Croquetas de atún con papa y mozzarella",d:"Machaca 2 papas cocidas con ⅔ de lata de atún escurrido (≈ 90 g), 30 g de queso mozzarella rallado, cebolla picada, sal y pimienta. Forma 4–5 croquetas y dóralas en sartén con 1 cdita de aceite o en air fryer a 200 °C por 12 min. Con 1 tortilla y 1 taza de verduras cocidas.",tip:"Mismos equivalentes que antes: el mozzarella cuenta como 1 AOA y trae su propia grasa, por eso solo va 1 cdita de aceite. La papa amarra la croqueta sin necesidad de huevo."}},
    jue:{com:{t:"Pollo al horno con papas y charros",d:"90 g de pollo al horno, 2 papas, 2 tortillas, ½ taza de frijoles charros y 1 taza de verduras."},
         cen:{t:"Bowl de arroz verde y pollo",d:"1 taza de arroz verde, 75 g de pollo, 1 taza de verduras salteadas en 2 cditas de aceite y 1 tortilla."}},
    vie:{com:{t:"Pescado empapelado",d:"120 g de filete de tilapia crudo en papel aluminio con jitomate, cebolla, chile, limón y 2 cditas de aceite; 15 min en horno o sartén tapado. Con 1 taza de arroz, ½ taza de charros y 2 tortillas."},
         cen:{t:"Caldo de res",d:"La porción congelada: caldo con res, papa y verduras, y 3 tortillas."}},
    sab:{com:{t:"Bistec en salsa roja",d:"90 g de bistec guisado en salsa de jitomate y chile, 1 taza de arroz, ½ taza de frijoles charros y 2 tortillas."},
         cen:{t:"Tacos de pollo al horno",d:"La porción congelada: 75 g de pollo en 5 tortillas con verduras salteadas en 2 cditas de aceite."}}},
   steps:[
    ["0:00","Caldo de res a la olla exprés.","400 g de pulpa o chambarete magro en cubos, 2.5 L de agua, cebolla, ajo y sal. 35 min desde que suena. Destapa, agrega 4 papas, 2 zanahorias, 2 calabacitas, 1 chayote y 1 taza de ejotes, y cocina 12 min sin presión. Salen 4 porciones."],
    ["0:05","Pollo al horno.","1.2 kg de pechuga con 1 cda de aceite, ajo en polvo, paprika, comino, limón y sal. Horno 200 °C 25 min o air fryer 180 °C 18 min. Rebánalo ya frío."],
    ["0:10","Arroz verde.","Licúa 1 chile poblano asado y sin semillas (o 1 manojo de cilantro) con ajo, cebolla y 4 tazas de agua. Sofríe 2 tazas de arroz en 1 cda de aceite, agrega lo licuado y cocina 20 min tapado."],
    ["0:20","Frijoles charros.","3 bolsas de frijoles enteros cocidos con 2 jitomates, 1 cebolla, 2 serranos y cilantro picados. 15 min, sin tocino ni chorizo."],
    ["0:35","Papas.","2 papas en gajos con 1 cdita de aceite, junto al pollo en el horno, para el lunes."],
    ["0:55","Arma 6 burritos.","Tortilla de harina grande, ½ taza de charros escurridos y machacados y 50 g de pollo picado. Aluminio y al congelador."],
    ["1:15","Porciona y enfría.","Arroz extendido y al refri antes de 1 hora."],
    ["1:30","Listo.",""]],
   store:[["Caldo de res · 4 porciones","2 (lunes y miércoles)","2 (cena del viernes y 1 de reserva)"],
          ["Pollo al horno · ≈ 480 g libres","Cena del lunes, comida y cena del martes","Comida y cena del jueves, cena del sábado"],
          ["Burritos · 6","Pasa uno al refri cada noche","6"],
          ["Frijoles charros","3 tazas","El resto, en bolsas de ½ taza"],
          ["Arroz verde · ≈ 6 tazas","3 tazas","El resto, en bolsas de 1 taza"]],
   wed:"cuece 2 papas en el microondas para el jueves.",
   shop:[
    ["Proteína",["Pechuga de pollo sin piel, 1.2 kg","Pulpa o chambarete de res magro, 400 g","Bistec de res, 100 g","Filete de tilapia, 1 (≈ 120 g)","Atún en agua, 3 latas (2 de reserva)","Queso mozzarella, 50 g"]],
    ["Cereales y tubérculos",["Arroz, 1 kg","Papa mediana, 2 kg (incluye las de las croquetas)","Tortilla de maíz, 1 kg","Tortillas de harina grandes, 1 paquete","Tortillas de harina chicas, 1 paquete","Pan de caja integral, 1 paquete","Avena en hojuela, 300 g"]],
    ["Leguminosas",["Frijoles enteros cocidos, 3 bolsas"]],
    ["Leche y fruta",["Leche descremada o deslactosada light, 4 L","Plátanos, 16 (congela 7 pelados para el frappé)","Manzanas, 3","Café (opcional)"]],
    ["Verduras",["Chile poblano, 1 (o cilantro, 2 manojos)","Zanahoria, 3","Calabacita, 4","Chayote, 1","Ejotes, 250 g","Jitomate, 8","Cebolla, 4","Chile serrano, 3","Limones","Verduras mixtas congeladas, 2 bolsas"]],
    ["Grasas, azúcares y sazón",["Crema de cacahuate natural (si se acabó)","Cacahuates naturales","Aceite de canola u oliva","Miel o mermelada","Paprika, ajo en polvo, comino","Papel aluminio, salsa roja sin aguacate"]]]}
  ];

  var HRS={
    LM:{des:"6:15",pre:"10:30",com:"13:45",col:"17:00",cen:"20:30"},
    MJ:{des:"6:15",pre:"8:45",com:"12:15",col:"16:00",cen:"19:30"},
    V:{des:"7:30",col:"10:30",com:"12:45",pre:"17:00",cen:"20:15"},
    S:{des:"8:00",col:"11:45",com:"14:30",pre:"17:30",cen:"20:30"},
    D:{des:"9:00",col:"11:30",com:"14:30",pre:"17:30",cen:"20:30"}
  };
  var HNOTE={
    LM:{pre:"después de Cirugía, 75 min antes del gym",com:"post-entreno",col:"tarde libre",cen:"después de Gastro"},
    MJ:{pre:"entre Oftalmología y Psiquiatría, 90 min antes del gym",com:"post-entreno, antes de Campos",col:"pausa en Campos: llévala lista",cen:"después de Campos"},
    V:{com:"antes de Anfiteatro: es tu comida pre-entreno",pre:"después del gym, con o sin batido"},
    S:{des:"también es tu pre-entreno",col:"post-entreno",pre:"hoy no hay gym en la tarde"},
    D:{}
  };
  /* cuando el gym no va después, el pre-entreno se come como merienda */
  var HNAME={V:{pre:"Merienda"},S:{pre:"Merienda"},D:{pre:"Merienda"}};
  var DAYS=[
    {k:"dom",s:"Dom",n:"Domingo",gym:"Descanso · día de batch",h:"D",cl:"Sin clases. Hoy cocinas el batch del menú que sigue (pestaña Domingo de batch)."},
    {k:"lun",s:"Lun",n:"Lunes",gym:"Gym: Empuje",h:"LM",cl:"Otorrino 7:00, Cirugía 8:30–10:15 y Gastroenterología 19:00–20:15. Gym a las 11:45."},
    {k:"mar",s:"Mar",n:"Martes",gym:"Gym: Pull day",h:"MJ",cl:"Oftalmología 7:00, Psiquiatría 9:00–10:15 y Campos Clínicos 13:00–18:00. Gym a las 10:15."},
    {k:"mie",s:"Mié",n:"Miércoles",gym:"Gym: Pierna A",h:"LM",cl:"Otorrino 7:00, Cirugía 8:30–10:15 y Gastroenterología 19:00–20:15. Gym a las 11:45."},
    {k:"jue",s:"Jue",n:"Jueves",gym:"Gym: Brazos",h:"MJ",cl:"Oftalmología 7:00, Psiquiatría 9:00–10:15 y Campos Clínicos 13:00–18:00. Gym a las 10:15."},
    {k:"vie",s:"Vie",n:"Viernes",gym:"Gym: Torso",h:"V",cl:"Mañana libre y das Anfiteatro de 13:30 a 15:00. Gym a las 15:00."},
    {k:"sab",s:"Sáb",n:"Sábado",gym:"Gym: Pierna B",h:"S",cl:"Sin clases. Gym a las 10:00."}
  ];

  /* rotación: la semana del lunes 2 de nov de 2026 es el Menú 1; el domingo ya cuenta como la semana siguiente (día de batch) */
  function weekMenu(d){var base=new Date(2026,10,2);var x=new Date(d.getFullYear(),d.getMonth(),d.getDate());var diff=Math.round((x-base)/864e5);if(x.getDay()===0)diff+=1;var w=Math.floor(diff/7);return ((w%4)+4)%4;}
  var X=[
    ["C",[["Arroz cocido","¼ taza"],["Papa cocida","½ pieza mediana (≈ 85 g)"],["Tortilla de maíz","1 pieza"],["Pan de caja integral","1 rebanada"],["Avena en hojuela","20 g (2 cdas copeteadas)"],["Pasta o fideo cocido","½ taza"],["Bolillo sin migajón","½ pieza"]]],
    ["CG",[["Tortilla de harina chica","1 pieza (≈ 30 g)"],["Tortilla de harina grande","= 2 equivalentes"]]],
    ["LG",[["Frijoles cocidos o charros","½ taza"],["Lentejas cocidas","½ taza"]]],
    ["MB",[["Pechuga de pollo","30 g crudo ≈ 25 g cocido"],["Atún en agua escurrido","30–40 g (≈ ⅓ de lata)"],["Pescado blanco (tilapia)","40 g crudo"],["Proteína en polvo","1 scoop (30 g) = 3 eq"]]],
    ["AB",[["Res molida 90/10","30 g crudo"],["Bistec, pulpa o chambarete magro","30 g crudo"],["Lomo de cerdo","30 g crudo"],["Pierna o muslo sin piel","30 g de carne cruda"]]],
    ["L",[["Leche descremada o deslactosada light","1 taza (240 ml)"],["Yogur griego natural sin azúcar","½ taza (da más proteína)"]]],
    ["F",[["Plátano","½ pieza"],["Manzana","1 pieza"],["Mango","½ pieza"],["Papaya picada","1 taza"]]],
    ["V",[["Zanahoria, calabacita, chayote, ejote, nopal","½ taza cocida"],["Jitomate o tomate verde","1 pieza / ½ taza en salsa"],["Verduras mixtas congeladas","½ taza"],["Chile, cilantro, limón, cebolla en salsa","libres"]]],
    ["G",[["Aceite (canola, oliva, maíz)","1 cdita"],["Mayonesa (lleva poco huevo)","1 cdita"]]],
    ["GP",[["Crema de cacahuate","2 cditas (≈ 10 g)"],["Cacahuates naturales","14 piezas"],["Almendras","10 piezas"]]],
    ["AZ",[["Miel","2 cditas"],["Mermelada","2 cditas"],["Azúcar","2 cditas"]]]
  ];
