---
title: "Mínimo no significa incompleto"
description: "Cómo hacer una primera versión pequeña sin dejarla a medias: menos cosas, pero bien terminadas."
date: "2026-06-04"
author: "Bas Bravo"
locale: "es"
category: "Producto"
keywords: ["MVP", "producto mínimo viable", "primera versión de un producto", "alcance de un MVP", "desarrollo de MVP"]
---

Al empezar un producto casi siempre pasa lo mismo. Hay una lista larga de funciones, alguien dice que hay que hacer un MVP, la versión más pequeña posible, y se tacha la mitad. Por un momento parece que el problema está resuelto.

Casi nunca lo está.

Quitar funciones no garantiza un producto más pequeño. A veces solo deja el mismo producto a medias: pantallas sueltas, un camino que se corta o una pieza que falta justo cuando alguien necesita fiarse del resultado.

Para mí, una buena primera versión consiste en **hacer menos, pero terminar bien lo que decidimos cuidar**. Elegir a una persona, una situación y un resultado, y acompañarla de principio a fin. Lo demás puede esperar.

![Un circuito de tren cerrado y pequeño: se pueden quitar las ampliaciones, pero no un tramo de vía.](figure:circuit)

---

## Pensar en un camino, no en una lista

En una lista, todas las funciones parecen igual de importantes. Por eso discutir cuáles quitar no lleva a ninguna parte.

Me resulta más útil pensar en el camino de una persona: llega con una intención, consigue un resultado y entiende qué puede hacer después.

Imagina una herramienta para aprobar compras en una empresa. Podría tener muchos tipos de solicitud, reglas, comentarios, avisos e informes. Pero el camino básico es corto: alguien pide algo, otra persona lo revisa, decide, y quien lo pidió se entera.

![Una tubería de cuatro pasos que devuelve el agua a quien la envió; si falta un paso, se derrama.](figure:pipeline)

Con ese camino claro, ya se puede recortar con criterio. Podemos empezar con un solo tipo de solicitud, elegir a los responsables a mano y dejar los informes para más adelante. Lo que no podemos hacer es quitar la revisión, o dejar a alguien sin saber qué pasó con su solicitud.

Así, la pregunta deja de ser «¿qué función me gusta más?» y pasa a ser esta:

> ¿Qué tiene que ocurrir para que este camino funcione de verdad?

## Probar una idea no es lo mismo que entregar un producto

Parte de la confusión viene de que llamamos MVP a cosas muy distintas.

Una prueba puede ser un dibujo, una maqueta o un servicio hecho a mano por detrás. Sirve para aprender, y puede usar datos inventados. Un producto, en cambio, se enfrenta a la realidad: alguien entra sin ayuda, se equivoca, vuelve otro día y espera encontrar su trabajo como lo dejó.

Y Combinator lo resume así: un MVP es un producto real que quien lo usa siente terminado, aunque solo sirva para una tarea muy concreta.[^1] Marty Cagan añade tres preguntas: ¿aporta valor?, ¿se usa con facilidad? y ¿el equipo puede construirlo y mantenerlo?[^2]

No hace falta discutir el nombre. Lo importante es saber qué estamos preparando: una prueba para aprender, o algo que otra persona usará por su cuenta. Los problemas empiezan cuando llamamos producto a algo que solo funciona si estamos al lado explicándolo.

## Lo que se recorta es cantidad, no cuidado

Cuando se habla de ir rápido, es fácil confundir calidad con cantidad. Se pueden dejar para después muchas opciones y tareas automáticas. Lo que no se puede dejar es algo tan básico como saber si una acción se ha guardado, o quién puede ver información privada.

Una primera versión no necesita estar pulida en cada rincón. Necesita cuidado donde se apoya su promesa. Yo lo reviso en cuatro sitios:

- **Que sirva.** La persona puede conseguir lo que vino a hacer.
- **Que se entienda.** Se ve qué está pasando y qué se puede hacer, también cuando algo sale mal.
- **Que se pueda confiar.** Cada cual ve solo lo suyo, los datos son correctos y, si algo falla, el trabajo no se pierde.
- **Que enseñe algo.** Podremos saber si se usa y por qué, y qué haremos con eso.

Si algo no ayuda a ninguna de las cuatro, probablemente pueda esperar. Si sostiene alguna, no basta con llamarlo «detalle». Eso sí, el cuidado depende del riesgo: no es lo mismo ordenar imágenes de referencia que guardar pagos o datos médicos.

## Cuatro formas de empezar más pequeño

Quitar pantallas debería ser el último recurso. Antes hay otras formas de reducir el trabajo sin romper el camino.

**Elegir bien a quién ayudamos.** Construir «para equipos» obliga a resolver mil tamaños y situaciones. Empezar por quien coordina un equipo pequeño hace todo más claro.

**Empezar por un caso concreto.** Cubrir un proceso entero cuesta mucho. Empezar por el caso más frecuente ahorra trabajo y facilita que se entienda.

**Ofrecer menos opciones.** Un tipo de usuario, una plantilla o un idioma pueden bastar al principio. Cada opción extra hay que diseñarla, explicarla, probarla y mantenerla.

**Hacer a mano lo que aún no necesita ser automático.** Mientras haya pocas personas, el equipo puede revisar cuentas o resolver casos raros. Así se aprende antes de construir algo más complejo. Eso sí: hay que decidir quién lo hace, cuánto tarda y qué pasa si no está. Si no, no hemos reducido el producto, solo hemos escondido trabajo.

## Escribir lo que queda fuera

Una primera versión se vuelve más fácil de llevar cuando dejamos por escrito qué no entra: «no importaremos datos anteriores», «las solicitudes no se podrán editar», «la prueba será solo en español». Así lo descartado no vuelve disfrazado de pequeños ajustes.

El método *Shape Up* propone algo parecido: decidir antes cuánto tiempo merece una idea y adaptar el trabajo a ese tiempo.[^3] El límite ayuda a dar forma al producto.

También necesitamos saber qué queremos aprender. «Ver si la idea funciona» es demasiado vago. Mejor algo así:

> ¿Una persona de operaciones usará esta herramienta cada semana para aprobar solicitudes reales, sin volver a organizarse por correo?

Con esa pregunta se puede mirar cuántas solicitudes se crean, si la gente vuelve y qué sigue haciendo fuera de la herramienta. Y también hay que aceptar las señales que no nos gustan: si todo el mundo entra una vez y vuelve al correo, otro panel no lo arreglará.

Despertar interés, que alguien lo pruebe una vez y que lo use cada semana son cosas distintas. En una encuesta de Slush de 2025 a personas que habían fundado empresas en Europa, el 68 % decía que le resultaba fácil encontrar posibles clientes, pero solo el 30 % veía fácil convertirlos en clientes reales.[^4]

## Con la IA, construir de más es muy fácil

Hoy se puede pasar de una idea a una pantalla que funciona en muy poco tiempo. Es una gran ventaja, y también una tentación: si añadir una función parece barato, dejarla fuera parece desperdiciar una oportunidad.

Pero la primera versión de una función no es todo el trabajo. Todavía hay que encajarla con lo demás, pensar qué pasa en cada situación, probarla y mantenerla.

En una encuesta de Supabase de 2026, las dificultades técnicas bajaron del 24 % al 11 % como principal preocupación. Por delante quedaban encontrar clientes y saber si el producto responde a una necesidad real.[^5] Como la encuesta viene de una empresa del sector, conviene leerla con cautela, pero la idea es clara: poder construir algo no significa que debamos hacerlo.

El estudio DORA de casi cinco mil profesionales dice algo parecido: la IA amplifica lo que un equipo ya hace, para bien y para mal.[^6] Con una dirección clara, ayuda a avanzar. Sin ella, nos permite crear más confusión en menos tiempo.

Mi respuesta no es usar menos IA, sino cuidar más la decisión que viene antes. Cuando generar otra opción cuesta minutos, saber elegir importa todavía más.

## Cómo decido qué dejar fuera

No uso una fórmula rígida, pero esto me ayuda a ver pronto dónde intento abarcar demasiado.

Primero escribo qué cambio busco, en una frase: *para [una persona], cuando [vive una situación], el producto le ayuda a [conseguir algo] sin [el problema de hoy]*. Si necesito unir varias ideas con «y», seguramente hay más de un producto intentando entrar a la vez.

Después dibujo el camino completo, de cinco a siete pasos. No son pantallas, sino lo que la persona intenta conseguir en cada momento, incluido cómo sabe que ha terminado.

Luego nombro mi mayor duda: si el problema importa, si se usará, si se entenderá o si puedo hacerlo bien. La primera versión no tiene que resolverlas todas con la misma fuerza.

Con eso, reparto cada elemento en cuatro grupos. *Imprescindible*, si sin esto no hay resultado. *Cuidado*, si sin esto no deberíamos pedir a nadie que lo use de verdad. *A mano*, si el equipo puede hacerlo un tiempo con responsabilidad. Y *más adelante*, si aporta comodidad o crecimiento pero no cambia lo que queremos aprender ahora.

Por último, escribo lo que no entra y qué voy a observar. Los límites tienen que poder discutirse: si dejar algo fuera amenaza el valor principal, lo veremos antes de construir. Y si no, nos protegerán cuando esa idea vuelva a aparecer.

## Pequeño no significa provisional

Hay decisiones que cuestan mucho más de cambiar una vez lanzado el producto: quién puede acceder, a quién pertenece la información, cómo se borra, cómo se organiza o cómo se detectan los errores. No siempre necesitan una solución compleja, pero sí que alguien se haya parado a pensarlas.

Las normas europeas de protección de datos piden hacerlo desde el principio: para qué recogemos cada dato, quién lo necesita y cuánto tiempo debe existir.[^7] Con la accesibilidad pasa algo parecido: se trata de que personas con necesidades distintas puedan completar el camino esencial.

Mi criterio es sencillo. Si un atajo puede impedirnos aprender, hacer daño a alguien o volver muy difícil un cambio futuro, no es un buen recorte. Si solo reduce opciones o comodidad sin romper el resultado, probablemente sí.

Una primera versión no necesita parecer grande. Necesita una buena razón para ser pequeña. Puede tener trabajo manual, pocas opciones y decisiones temporales. Lo que no debería hacer es confundir descuido con velocidad.

Al cerrarla, me hago una última pregunta:

> Si alguien completa este camino, ¿habrá conseguido algo valioso y sabremos nosotros qué hacer después?

Si la respuesta es sí, probablemente tenemos una buena primera versión. Si solo tenemos una lista más corta, todavía no. En el siguiente artículo cuento [cómo decido qué aprender con cada versión](/es/articulos/construir-ya-no-es-el-cuello-de-botella).

[^1]: [Y Combinator, *Practical Design: MVP Spec*](https://www.ycombinator.com/blog/practical-design-mvp).
[^2]: [Marty Cagan, *Minimum Viable Product*](https://www.svpg.com/minimum-viable-product/), Silicon Valley Product Group.
[^3]: [Ryan Singer, *Set Boundaries*](https://basecamp.com/shapeup/1.2-chapter-03), en *Shape Up*.
[^4]: [Slush, *Startup Struggle Survey 2025*](https://impact.slush.org/startup-struggle-survey-2025.html), encuesta a 607 personas que habían fundado empresas jóvenes en Europa.
[^5]: [Supabase, *State of Startups 2026*](https://supabase.com/state-of-startups). La encuesta declara dos mil participantes y procede de una empresa que ofrece este tipo de herramientas.
[^6]: [Google Research, *DORA 2025 State of AI-assisted Software Development*](https://research.google/pubs/dora-2025-state-of-ai-assisted-software-development-report/).
[^7]: [Comisión Europea, principios de tratamiento de datos bajo el GDPR](https://commission.europa.eu/law/law-topic/data-protection/information-business-and-organisations/principles-gdpr_en).
