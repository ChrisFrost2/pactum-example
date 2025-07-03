require('dotenv').config();
const { spec, request } = require('pactum');
const { gt, lte } = require("pactum-matchers");

describe('hooks', function () {
  before(async () => {
    request.setDefaultTimeout(10000);
    request.setBaseUrl(`https://fn-techtest-ase.azurewebsites.net/api`);
  });

  it('should return list of companies for valid exchange symbol', async () => {
    const resp = await spec()
      .get('/exchanges/ASX/companies')
      .withQueryParams('code', process.env.API_KEY)
      .expectJsonLength('', gt(0))
      .expectStatus(200)
      .expectJsonLike('[0]',
        {
          "sector": "Basic Materials",
          "country": "CA",
          "fullTimeEmployees": "652",
          "symbol": "GSS",
          "name": "Genetic Signatures Limited",
          "price": null,
          "exchange": "Australian Securities Exchange",
          "exchangeShortName": "ASX",
          "type": "stock"
        });
  });

  it('should return empty list for unknown exchange symbol', async () => {
    const resp = await spec()
      .get('/exchanges/UNKNOWN/companies')
      .withQueryParams('code', process.env.API_KEY)
      .expectJson('[]', [])
      .expectJsonLength('[]', lte(0))
      .expectStatus(200);
  });

  it('should return status code 401 Unauthorized for wrong Api Key', async () => {
    const resp = await spec()
      .get('/exchanges/ASX/companies')
      .withQueryParams('code', 'wrongApiKey')
      .expectStatus(401)
      .expectBody("");
  });

  it('should return empty list for empty exchange symbol', async () => {
    const resp = await spec()
      .get('/exchanges//companies')
      .withQueryParams('code', process.env.API_KEY)
      .expectStatus(404)
      .expectBody("");
  });
});