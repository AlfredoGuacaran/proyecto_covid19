const dataPaises = [
  {
    location: 'US',
    confirmed: 61556085,
    deaths: 839500,
    recovered: 0,
    active: 0,
  },
  {
    location: 'India',
    confirmed: 35875790,
    deaths: 484213,
    recovered: 0,
    active: 0,
  },
  {
    location: 'Brazil',
    confirmed: 22563104,
    deaths: 620366,
    recovered: 0,
    active: 0,
  },
  {
    location: 'United Kingdom',
    confirmed: 14708999,
    deaths: 150712,
    recovered: 0,
    active: 0,
  },
  {
    location: 'France',
    confirmed: 12311963,
    deaths: 126707,
    recovered: 0,
    active: 0,
  },
  {
    location: 'Russia',
    confirmed: 10485705,
    deaths: 310513,
    recovered: 0,
    active: 0,
  },
  {
    location: 'Turkey',
    confirmed: 10045658,
    deaths: 83843,
    recovered: 0,
    active: 0,
  },
  {
    location: 'Germany',
    confirmed: 7570361,
    deaths: 114127,
    recovered: 0,
    active: 0,
  },
  {
    location: 'Italy',
    confirmed: 7554344,
    deaths: 139265,
    recovered: 0,
    active: 0,
  },
];

/// autenticacion
async function getToken(email, password) {
  try {
    const response1 = await fetch('http://localhost:3000/api/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (!response1.status) return;

    const { token } = await response1.json();

    return token;
  } catch (error) {
    console.log('error');
  }
}

// funcion para esconder el login y mostrar el contenido
function domLogin() {
  $('#div-form').removeClass('d-block').addClass('d-none');
  $('#contenido').removeClass('d-none').addClass('d-block');
}

// funcion para traer data de todos los paises, retorna array de objetos
async function getAllCountriesData() {
  try {
    const response = await fetch('http://localhost:3000/api/total');
    const data = await response.json();
    // console.log(data.data);

    // return dataPaises;

    return data.data;
  } catch (error) {
    console.error(error);
  }
}

//funcion para filtrar y ordenar la data, retorna array de objetos
async function moreThan10000() {
  try {
    const allCountriesData = await getAllCountriesData();

    const moreThan1000 = allCountriesData.filter(
      (country) => country.deaths >= 50000
    );

    const moreThan1000Sort = moreThan1000.sort((a, b) => b.deaths - a.deaths);
    console.log(moreThan1000Sort);
    return moreThan1000Sort;
  } catch (error) {
    console.error(error);
  }
}

// funcion para renderizar tabla con todos los paises
function renderTabla(dataCounries) {
  dataCounries.forEach((country) => {
    $('#tabla-body').append(`
        <tr>
            <th scope="row">${country.location}</th>
            <td>${country.confirmed}</td>
            <td>${country.recovered}</td>
            <td>${country.active}</td>
            <td>${country.deaths}</td>
        </tr>
    `);
  });
}

// funcion para renderizar el grafico
function iniciarGrafico(dataGrafico) {
  // datapoints
  const confirmados = [];
  const muertos = [];
  for (pais of dataGrafico) {
    confirmados.push({
      label: pais.location,
      y: pais.confirmed,
    });
    muertos.push({
      label: pais.location,
      y: pais.deaths,
    });
  }

  const covidData = [
    {
      type: 'column',
      name: 'Casos Muertos',
      legendText: 'Casos Muertos',
      showInLegend: true,
      dataPoints: muertos,
    },
    {
      type: 'column',
      name: 'Casos Confirmados',
      legendText: 'Casos Confirmados',
      showInLegend: true,
      dataPoints: confirmados,
    },
  ];

  const chart = new CanvasJS.Chart('chartContainer', {
    animationEnabled: true,
    title: {
      text: 'Países con Covid19',
    },
    axisY: {
      titleFontColor: '#4F81BC',
      lineColor: '#4F81BC',
      labelFontColor: '#4F81BC',
      tickColor: '#4F81BC',
    },
    toolTip: {
      shared: true,
    },
    legend: {
      cursor: 'pointer',
    },
    data: covidData,
  });
  chart.render();
}

/// login form
$('#login-form').on('submit', async function (event) {
  try {
    //Previene recarga de pag
    event.preventDefault();
    //Captura datos del formulario
    const email = $('#email-input').val();
    const password = $('#password-input').val();

    //primera llamada a api para solicitar Token
    const token = await getToken(email, password);

    //en caso de que las credenciales sean invalidas
    if (!token) return $('.form-control').addClass('is-invalid');

    //guarda token en localStorage
    localStorage.setItem('token', token);

    //esconde el login y muestra el contenido...
    domLogin();

    // render del grafico
    const graficoData = await moreThan10000();
    iniciarGrafico(graficoData);

    // render tabla
    const tablaData = await getAllCountriesData();
    renderTabla(tablaData);
  } catch (error) {
    console.log('Error');
    console.error(error);
  }
});
