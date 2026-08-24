---
title: "De ejecutar tareas a responder por el resultado"
description: "Cómo evoluciona el trabajo del desarrollador cuando la IA acelera la ejecución y aumenta el valor del criterio, el contexto y la visión global del producto."
date: "2026-07-03"
author: "Bas Bravo"
locale: "es"
category: "Desarrollo"
---

Un ticket pide añadir recordatorios automáticos a una herramienta de aprobación de compras. La tarea parece clara: programar el envío, preparar el mensaje y marcar cuándo se ha enviado. Con ayuda de la IA, un desarrollador puede localizar las piezas del sistema, proponer el cambio, escribir las pruebas y tener una primera versión en muy poco tiempo.

El código puede ser correcto y, aun así, no mejorar nada.

Quizá las solicitudes siguen paradas porque llegan sin la información necesaria. Tal vez se asignan a una persona que está ausente o nadie entiende quién debe tomar la decisión. Otro correo no reduce la espera; solo añade ruido a un proceso que continúa roto.

Durante años hemos organizado buena parte del desarrollo alrededor de tareas: implementar una pantalla, crear un endpoint, corregir un error. La IA hace esas unidades de trabajo cada vez más rápidas de producir. Pero cuanto menos cuesta ejecutar una solución, más importante resulta comprobar que hemos elegido bien el problema, que entendemos sus consecuencias y que sabremos reconocer el resultado.

**El desarrollador no deja de necesitar técnica. Necesita utilizarla dentro de un campo de visión más amplio: pasar de cumplir una instrucción a compartir la responsabilidad por el resultado.**

![Una persona observa el recorrido completo de una red ferroviaria mientras los mecanismos ejecutan distintos cambios de vía.](/articles/de-ejecutar-tareas-a-responder-por-el-resultado/red-ferroviaria-y-destino.png "Cuando ejecutar cada cambio cuesta menos, elegir el destino, coordinar el recorrido y comprobar la llegada adquiere más valor.")

---

## Una tarea puede terminar y el producto seguir en el mismo sitio

Hay evidencia de que las herramientas de IA pueden acelerar partes del desarrollo. Un estudio publicado en *Management Science* combinó tres experimentos aleatorizados con 4.867 desarrolladores de Microsoft, Accenture y otra gran empresa. El grupo con acceso a un asistente de código completó un 26,08 % más de tareas, aunque el efecto varió entre los experimentos.[^1]

También hay resultados distintos. A comienzos de 2025, METR observó que 16 desarrolladores experimentados tardaban un 19 % más al utilizar IA en 246 tareas de proyectos que conocían bien. Cuando intentó repetir la medición con herramientas más recientes, la adopción de agentes, la selección de participantes y el trabajo en paralelo hicieron que el efecto actual ya no pudiera estimarse con fiabilidad.[^2]

Contar tareas completadas sirve para responder a una pregunta concreta. No dice por sí solo si esas tareas redujeron el tiempo de aprobación, evitaron errores o crearon algo que las personas prefieren utilizar. El marco SPACE, desarrollado por investigadores de Microsoft, GitHub y la Universidad de Victoria, ya advertía antes de esta ola de IA que la productividad de un desarrollador no puede reducirse a una sola medida de actividad.[^3]

Producir código, cerrar tickets o abrir cambios son señales de movimiento. El resultado aparece en el comportamiento del producto, la calidad del sistema y el efecto de ambos sobre las personas y el negocio.

## La técnica no pierde importancia; cambia lo que hacemos con ella

Decir que ahora importa más el criterio puede interpretarse como si entender el software fuera opcional. Ocurre lo contrario.

Cuando una propuesta llega escrita en segundos, necesitamos reconocer si rompe un límite de seguridad, duplica una regla, degrada el rendimiento o resuelve solo el caso ideal. Delegar exige describir restricciones; revisar exige entender qué debería ocurrir y qué podría fallar.

En la encuesta de Stack Overflow de 2025, el 66 % de quienes respondieron señaló como frustración recibir soluciones de IA casi correctas, pero no del todo. Un 46 % desconfiaba de la precisión de estas herramientas, frente a un 33 % que confiaba en ella.[^4] La generación reduce parte del esfuerzo de escribir; no elimina el trabajo de comprender, integrar y responder por lo que se entrega.

Lo que pierde valor relativo no es saber programar, sino depender de la producción manual de cada detalle como única aportación. Recordar una sintaxis o repetir una estructura común diferencia menos. Construir un modelo mental del sistema, elegir sus límites, investigar un fallo y juzgar una compensación siguen siendo capacidades técnicas. La IA amplía su alcance, tanto para quien puede evaluar el resultado como para quien todavía no sabe dónde está equivocado.

## De una instrucción cerrada a un objetivo compartido

Una tarea describe una acción. Un objetivo describe el cambio que esperamos conseguir. Los dos son necesarios, pero no deberían ocupar el mismo lugar.

| Si empezamos por una tarea | Si empezamos por un objetivo |
| --- | --- |
| “Añadir recordatorios automáticos.” | “Reducir el tiempo que una solicitud válida permanece sin decisión.” |
| La solución ya viene elegida. | Todavía podemos comparar soluciones. |
| El alcance termina en el componente modificado. | El alcance incluye el recorrido, los datos y las consecuencias. |
| El éxito es que el cambio funcione y se publique. | El éxito exige además observar si cambia la señal acordada. |
| La IA recibe una especificación de implementación. | La IA puede ayudar a investigar, proponer, ejecutar y verificar dentro de unos límites. |
| La conversación termina al cerrar el ticket. | Lo aprendido vuelve a la siguiente decisión. |

No todos los tickets necesitan una investigación estratégica. Cambiar un texto incorrecto o actualizar una dependencia bien acotada puede seguir siendo una tarea directa. El problema aparece cuando utilizamos esa misma lógica para decisiones que esconden dudas sobre el usuario, el proceso o el negocio.

En el ejemplo de las aprobaciones, el objetivo todavía necesita precisión. ¿Queremos reducir la media o evitar los casos extremos? ¿Solo cuentan las solicitudes que contienen todos los datos? ¿Qué plazo sería valioso? ¿Podemos reducirlo a costa de multiplicar notificaciones? Una formulación más útil podría ser:

> Reducir de tres días a uno el tiempo mediano de decisión de las solicitudes completas, sin aumentar los reenvíos ni las notificaciones ignoradas.

Las cifras son hipotéticas, pero hacen explícito el criterio y permiten discutir la señal. Ahora el recordatorio es una opción, no la definición del trabajo.

## Una visión global no significa hacer todos los trabajos

Mirar el producto de forma global no convierte al desarrollador en responsable único de estrategia, investigación, diseño, ventas, soporte y tecnología. Esas disciplinas necesitan experiencia propia y, según el producto, personas especializadas.

La visión global consiste en entender cómo se relaciona una decisión técnica con el resto del sistema y saber cuándo incorporar otra perspectiva.

| Perspectiva | Lo que el desarrollador necesita entender | Con quién debe contrastarlo |
| --- | --- | --- |
| **Persona** | Qué intenta conseguir, en qué contexto y qué le impide hacerlo hoy. | Investigación, diseño, soporte y personas usuarias. |
| **Producto** | Qué comportamiento esperamos cambiar y qué evidencia justificaría continuar. | Producto, datos y responsables del negocio. |
| **Experiencia** | Cómo se descubre, comprende, completa y recupera el recorrido. | Diseño, contenido y accesibilidad. |
| **Sistema** | Datos, dependencias, permisos, fallos, rendimiento y capacidad de evolución. | Ingeniería, seguridad, plataforma y operación. |
| **Negocio y riesgo** | Coste, límites legales, compromisos comerciales y daño posible de un error. | Dirección, ventas, legal, privacidad y operaciones. |

No se trata de tener la última palabra en cada columna, sino de no tratar ninguna como si no existiera. La IA aumenta la capacidad de ejecución y reduce el tiempo para detectar una mala dirección; colaborar permite conservar el contexto mientras las opciones se multiplican.

## El criterio no es una opinión con más experiencia

El criterio puede parecer una cualidad difícil de enseñar o comprobar. Sin embargo, no consiste en acertar por intuición. Consiste en tomar una decisión proporcional a la evidencia, hacer visibles las suposiciones y reconocer qué resultado obligaría a cambiarla.

Un estudio presentado en CHI 2025 analizó 936 ejemplos de uso de IA aportados por 319 profesionales del conocimiento. Una mayor confianza en la herramienta se asociaba con menos pensamiento crítico, mientras que una mayor confianza de la persona en su propio conocimiento de la tarea se asociaba con más. El trabajo crítico no desaparecía: se desplazaba hacia verificar información, integrar respuestas y supervisar la tarea.[^5]

Es una distinción útil para el desarrollo. Revisar no es mirar un cambio generado hasta que parezca razonable. Es poder explicar:

- qué objetivo persigue;
- qué supuestos contiene;
- qué alternativas se descartaron y por qué;
- qué límites no debe cruzar;
- cómo demostraremos que funciona;
- y qué señal veremos después de publicarlo.

La IA puede buscar dependencias, descubrir casos límite, comparar alternativas y cuestionar un plan. Pero no conoce por sí sola los compromisos de la empresa, el riesgo aceptable ni qué resultado merece el coste. El contexto ausente no se vuelve verdadero porque la respuesta esté bien escrita.

## Un ciclo de trabajo orientado al resultado

Pasar de tareas a objetivos no exige convertir cada cambio en un proceso largo. Necesita un ciclo breve que conserve la relación entre la intención y lo que llega a producción.

![Un sistema de control conecta un destino, varios mecanismos de ejecución, sensores y una señal que regresa al punto de decisión.](/articles/de-ejecutar-tareas-a-responder-por-el-resultado/ciclo-de-control.png "Un objetivo solo orienta el trabajo cuando la ejecución produce evidencia y esa evidencia vuelve a la siguiente decisión.")

### 1. Nombrar el cambio antes que la solución

¿Quién debería poder hacer algo que hoy no puede? ¿Qué comportamiento, coste o riesgo esperamos modificar? Si la respuesta solo describe una interfaz o una función, todavía estamos hablando de la solución.

Para las aprobaciones, “enviar un recordatorio” se convierte en “reducir el tiempo hasta una decisión de las solicitudes completas”.

### 2. Reunir el contexto que puede cambiar la decisión

No necesitamos conocer todo el negocio. Sí las condiciones que harían inútil o peligrosa la solución: cómo llega la solicitud, quién la recibe, qué información falta, qué ocurre durante una ausencia y qué datos son sensibles.

Aquí la IA es especialmente útil para recorrer el código, resumir documentación y señalar preguntas. La conversación con quienes utilizan y operan el proceso sigue siendo necesaria para descubrir lo que nunca se escribió.

### 3. Elegir la intervención más pequeña que pueda producir evidencia

Quizá el problema se resuelva mostrando antes los campos incompletos, reasignando solicitudes durante una ausencia o creando una vista clara de pendientes. Tal vez el recordatorio sí sea la mejor opción. El objetivo permite comparar coste, reversibilidad y señal esperada antes de comprometerse.

El artículo anterior explicaba por qué [construir ya no es el cuello de botella](/es/articulos/construir-ya-no-es-el-cuello-de-botella): una versión merece la pena cuando reduce una incertidumbre real. Aquí aplicamos la misma idea al trabajo diario del desarrollador.

### 4. Definir la prueba y después delegar la ejecución

Antes de generar código, acordamos qué debe permanecer cierto: una solicitud no puede notificarse dos veces, solo la persona adecuada puede verla, una reasignación conserva el historial y un fallo del proveedor de correo no bloquea el resto del proceso.

Después podemos repartir el trabajo entre personas y agentes según su riesgo. DORA recomienda lotes pequeños porque facilitan la revisión, las pruebas y la integración; su investigación de 2025 los identifica además como una práctica que ayuda a convertir la velocidad de la IA en rendimiento del producto y no en inestabilidad.[^6]

### 5. Cerrar el ciclo fuera del repositorio

Las pruebas confirman que el sistema hace lo acordado. La observación posterior responde a otra pregunta: ¿sirvió?

Mediremos el tiempo hasta la decisión, pero también devoluciones, reenvíos y notificaciones ignoradas. Si la espera continúa, habremos obtenido evidencia de que la causa estaba en otro lugar. El error sería cerrar la tarea sin mirar.

## Las habilidades que aumentan su valor

Este cambio no elimina el oficio del desarrollador. Cambia qué partes del oficio crean más ventaja.

### Formular problemas que se puedan comprobar

Transformar una petición en una consecuencia observable, separando la necesidad de la solución sugerida.

### Construir modelos mentales, no solo artefactos

Entender cómo se relacionan interfaz, datos, permisos, operación y comportamiento humano. La arquitectura también sirve para contener errores y conservar opciones.

### Diseñar límites para la delegación

Dar a la IA contexto, restricciones y una definición de éxito. Cuanto mayor sea el impacto o menor la reversibilidad, más explícito debe ser el control.

### Verificar en varias escalas

Revisar una función, probar un recorrido, observar producción y comprobar el resultado. Una prueba puede demostrar que se envió un correo; no que la aprobación llegó antes.

### Comunicar decisiones y compensaciones

Explicar por qué una alternativa es más segura, barata o informativa, haciendo visible qué sabemos y qué suponemos.

### Aprender de la operación y de las personas

Leer métricas, atender incidencias y observar usos inesperados. El criterio se forma al comparar decisiones con consecuencias, no al acumular respuestas.

## Hay contextos en los que la profundidad técnica pesa todavía más

No todos los cambios permiten la misma amplitud. En criptografía, infraestructura, sistemas en tiempo real, migraciones críticas, seguridad o software que afecta a la salud y los derechos, una intuición generalista no sustituye el conocimiento especializado.

Incluso en productos convencionales, el rendimiento, la accesibilidad o los permisos pueden contener el riesgo principal. Una visión global sirve para detectarlo y acercar a la persona adecuada.

Para quien empieza, la IA puede entregar una solución antes de que exista el modelo mental necesario para evaluarla. Pedir explicaciones, comparar enfoques y comprobar predicciones acelera el aprendizaje; aceptar cada propuesta porque funciona en el caso visible oculta las lagunas.

Las habilidades técnicas se desplazan desde la producción rutinaria hacia la comprensión, la decisión y la verificación. Donde el coste de un error es alto, ese desplazamiento las vuelve aún más importantes.

## El equipo también tiene que permitir esta evolución

No podemos pedir a los desarrolladores que respondan por resultados si solo reciben soluciones cerradas, no tienen acceso a personas usuarias ni datos y se les mide por la velocidad con la que vacían una lista.

Silicon Valley Product Group distingue los equipos de entrega, organizados alrededor de funciones y output, de los equipos de producto, que reciben problemas, trabajan de forma interdisciplinar y responden por outcomes.[^7] Es un modelo de trabajo, no una consecuencia automática de instalar herramientas de IA.

De hecho, acelerar a cada individuo puede aumentar la descoordinación. En el *State of Teams 2026* de Atlassian, basado en una encuesta a 12.035 profesionales del conocimiento y 173 ejecutivos, el 89 % de estos últimos decía que la IA aumentaba la velocidad, pero solo el 6 % podía señalar con claridad un retorno en toda la organización.[^8] Como procede de una empresa que vende herramientas de colaboración y no mide solo desarrollo, conviene tratarlo como una señal. La tensión sí es reconocible: más producción crea más decisiones, revisiones y dependencias si el objetivo compartido no mejora.

Trabajar por resultados exige objetivos observables, acceso al contexto, libertad para cuestionar la solución, cambios reversibles, responsabilidad clara sobre el riesgo y tiempo para mirar qué ocurrió después de publicar.

La autonomía sin contexto produce apuestas desconectadas. El contexto sin autonomía produce ejecutores mejor informados. Necesitamos ambos.

## Siete preguntas antes de empezar la siguiente tarea

No todas requieren una respuesta extensa. Formularlas ya cambia la calidad de la conversación.

1. **¿Qué resultado queremos cambiar y para quién?**
2. **¿Qué señal nos permitirá saber si ha cambiado?**
3. **¿Qué parte de la petición es una necesidad y qué parte es una solución propuesta?**
4. **¿Qué contexto de producto, experiencia, sistema o negocio podría invalidarla?**
5. **¿Qué podemos delegar y qué necesita juicio especializado?**
6. **¿Qué debe demostrar el cambio antes de publicarse?**
7. **¿Quién observará el resultado y decidirá el siguiente paso?**

No se trata de añadir siete casillas a cada ticket. Se trata de evitar que la velocidad de implementación nos quite el tiempo que necesitábamos para pensar.

Los buenos desarrolladores nunca se limitaron a escribir código: también encontraban contradicciones y consecuencias que la especificación no veía. La IA hace más visible ese valor.

El nuevo paradigma no nos pide abandonar la técnica para convertirnos en generalistas superficiales. Nos pide combinar profundidad con contexto, utilizar la IA como capacidad delegada y mantener la responsabilidad humana sobre la dirección y el resultado.

Antes de aceptar el siguiente ticket tal como está escrito, conviene preguntar:

> Si implementamos esta tarea exactamente como se ha pedido, ¿qué resultado habrá cambiado y cómo lo sabremos?

Si no tenemos una respuesta, la tarea todavía no está lista. Si la tenemos, la IA puede ayudarnos a llegar antes. Pero seguir sabiendo adónde vamos continúa siendo nuestro trabajo.

[^1]: [Cui et al., *The Effects of Generative AI on High-Skilled Work: Evidence from Three Field Experiments with Software Developers*](https://doi.org/10.1287/mnsc.2025.00535), *Management Science*, estudio con 4.867 desarrolladores y herramientas de completado de código.
[^2]: [METR, *We are Changing our Developer Productivity Experiment Design*](https://metr.org/blog/2026-02-24-uplift-update/), actualización que explica tanto el resultado de 2025 como los límites para estimar el efecto de herramientas más recientes.
[^3]: [Forsgren et al., *The SPACE of Developer Productivity: There’s more to it than you think*](https://www.microsoft.com/en-us/research/publication/the-space-of-developer-productivity-theres-more-to-it-than-you-think/), Microsoft Research y *ACM Queue*.
[^4]: [Stack Overflow, *Developer Survey 2025: AI*](https://survey.stackoverflow.co/2025/ai), resultados sobre adopción, confianza y frustraciones de quienes utilizan herramientas de IA en desarrollo.
[^5]: [Lee et al., *The Impact of Generative AI on Critical Thinking*](https://doi.org/10.1145/3706598.3713778), CHI 2025, encuesta a 319 profesionales del conocimiento con 936 ejemplos de uso.
[^6]: [DORA, *Working in small batches*](https://dora.dev/capabilities/working-in-small-batches/), práctica actualizada con resultados del estudio de desarrollo asistido por IA de 2025.
[^7]: [Marty Cagan, *Product vs. Feature Teams*](https://www.svpg.com/product-vs-feature-teams/), Silicon Valley Product Group, sobre equipos orientados a outcomes frente a equipos orientados a output.
[^8]: [Atlassian Teamwork Lab, *The State of Teams 2026*](https://www.atlassian.com/blog/state-of-teams-2026), metodología y resultados de una encuesta global a profesionales del conocimiento y ejecutivos.
