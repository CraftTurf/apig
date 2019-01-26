import type { JestMockT } from 'jest';

import create, {
  ROUTE_NAME, findPatient, removePatient, updatePatient
} from './routes';

describe(`Routes: ${ROUTE_NAME}`, () => {
  const uid = 'dfa7fd57-5d6b-4563-b60e-6c9f78f19579';
  const services = {
    patients: {
      create: jest.fn().mockReturnValue('Patient entry created'),
      findById: jest.fn().mockReturnValue('Patient entry fetched'),
      removeById: jest.fn().mockReturnValue('Patient entry deleted'),
      updateById: jest.fn().mockReturnValue('Patient entry modified'),
    }
  };
  const validate = {
    string: jest.fn(),
    default: jest.fn(),
    boolean: jest.fn(),
    email: jest.fn(),
    min: jest.fn(),
    max: jest.fn(),
    number: jest.fn(),
    integer: jest.fn(),
    iso: jest.fn(),
    date: jest.fn(),
    regex: jest.fn(),
    valid: jest.fn(),
    binary: jest.fn(),
    encoding: jest.fn(),
    try: jest.fn(),
    guid: jest.fn(),
    required: jest.fn(),
    object: jest.fn().mockImplementation(() => ({
      keys: jest.fn().mockReturnValue({
        requiredKeys: jest.fn().mockReturnValue({
          optionalKeys: jest.fn().mockReturnValue({})
        })
      }),
      unknown: jest.fn().mockReturnValue({}),
    })),
    alternatives: jest.fn().mockImplementation(() => ({
      try: jest.fn().mockReturnValue({})
    })),
    array: jest.fn().mockImplementation(() => ({
      items: jest.fn().mockReturnValue({
        min: jest.fn().mockReturnValue({
          unique: jest.fn().mockReturnValue({})
        }),
      }),
    }))
  };
  validate.string.mockImplementation(() => validate);
  validate.boolean.mockImplementation(() => validate);
  validate.min.mockImplementation(() => validate);
  validate.max.mockImplementation(() => validate);
  validate.number.mockImplementation(() => validate);
  validate.iso.mockImplementation(() => validate);
  validate.date.mockImplementation(() => validate);
  validate.regex.mockImplementation(() => validate);
  validate.valid.mockImplementation(() => validate);
  validate.try.mockImplementation(() => validate);
  validate.guid.mockImplementation(() => validate);
  validate.encoding.mockImplementation(() => validate);
  validate.binary.mockImplementation(() => validate);
  validate.integer.mockImplementation(() => validate);
  validate.default.mockImplementation(() => validate);
  validate.email.mockImplementation(() => validate);
  validate.guid.mockImplementation(() => validate);
  validate.required.mockImplementation(() => validate);

  describe(`POST /${ROUTE_NAME}`, () => {
    const router = create({ services, validate });
    const responseData = 'Patient entry created';
    const statusCode = 201;
    const contentType = 'application/hal+json';
    let mockRequest: { log: JestMockT } = { log: null };
    let mockResponse = null;
    let mockData: JestMockT = null;
    let mockStatusCode: JestMockT = null;
    let mockContentType: JestMockT = null;

    beforeEach(() => {
      mockData = jest.fn();
      mockStatusCode = jest.fn();
      mockContentType = jest.fn();

      mockResponse = {
        response: mockData,
        code: mockStatusCode,
        type: mockContentType,
      };
      mockData.mockImplementation(() => mockResponse);
      mockStatusCode.mockImplementation(() => mockResponse);
      mockContentType.mockImplementation(() => mockResponse);
      mockRequest = { log: jest.fn() };
    });

    it(`sets HTTP method POST on /${ROUTE_NAME} path`, () => {
      expect(router.method).toBe('POST');
      expect(router.path).toBe(`/${ROUTE_NAME}`);
    });

    it('sets validation on request payload', () => {
      const { payload } = router.options.validate;
      expect(payload).toBeDefined();
    });

    it(`sets response HTTP status code to ${statusCode} on success`, async () => {
      await router.handler(mockRequest, mockResponse);
      expect(mockStatusCode.mock.calls[0][0]).toBe(statusCode);
    });

    it(`sets response HTTP header Content-Type to ${contentType} on success`, async () => {
      await router.handler(mockRequest, mockResponse);
      expect(mockContentType.mock.calls[0][0]).toBe(contentType);
    });

    it('returns response data on success', async () => {
      await router.handler(mockRequest, mockResponse);
      expect(mockData.mock.calls[0][0]).toBe(responseData);
    });

    it('logs tagged request', async () => {
      await router.handler(mockRequest, mockResponse);
      expect(mockRequest.log.mock.calls[0][0]).toEqual([`/${ROUTE_NAME}`]);
    });
  });

  describe(`GET /${ROUTE_NAME}`, () => {
    const router = findPatient({ services, validate });
    const responseData = 'Patient entry fetched';
    const statusCode = 200;
    const contentType = 'application/hal+json';
    let mockRequest: { log: JestMockT } = { log: null };
    let mockResponse = null;
    let mockData: JestMockT = null;
    let mockStatusCode: JestMockT = null;
    let mockContentType: JestMockT = null;

    beforeEach(() => {
      mockData = jest.fn();
      mockStatusCode = jest.fn();
      mockContentType = jest.fn();

      mockResponse = {
        response: mockData,
        code: mockStatusCode,
        type: mockContentType,
      };
      mockData.mockImplementation(() => mockResponse);
      mockStatusCode.mockImplementation(() => mockResponse);
      mockContentType.mockImplementation(() => mockResponse);
      mockRequest = {
        log: jest.fn(),
        params: jest.fn().mockReturnValue({ uuid: uid })
      };
    });

    it(`sets HTTP method GET on /${ROUTE_NAME} path`, () => {
      expect(router.method).toBe('GET');
      expect(router.path).toBe(`/${ROUTE_NAME}/{uuid}`);
    });

    it('sets validation on request params', () => {
      const { params } = router.options.validate;
      expect(params.uuid).toBeDefined();
    });

    it(`sets response HTTP status code to ${statusCode} on success`, async () => {
      await router.handler(mockRequest, mockResponse);
      expect(mockStatusCode.mock.calls[0][0]).toBe(statusCode);
    });

    it(`sets response HTTP header Content-Type to ${contentType} on success`, async () => {
      await router.handler(mockRequest, mockResponse);
      expect(mockContentType.mock.calls[0][0]).toBe(contentType);
    });

    it('returns response data on success', async () => {
      await router.handler(mockRequest, mockResponse);
      expect(mockData.mock.calls[0][0]).toBe(responseData);
    });

    it('logs tagged request', async () => {
      await router.handler(mockRequest, mockResponse);
      expect(mockRequest.log.mock.calls[0][0]).toEqual([`/${ROUTE_NAME}`]);
    });
  });

  describe(`DELETE /${ROUTE_NAME}`, () => {
    const router = removePatient({ services, validate });
    const responseData = 'Patient entry deleted';
    const statusCode = 204;
    let mockRequest: { log: JestMockT } = { log: null };
    let mockResponse = null;
    let mockData: JestMockT = null;
    let mockStatusCode: JestMockT = null;

    beforeEach(() => {
      mockData = jest.fn();
      mockStatusCode = jest.fn();

      mockResponse = {
        response: mockData,
        code: mockStatusCode,
      };
      mockData.mockImplementation(() => mockResponse);
      mockStatusCode.mockImplementation(() => mockResponse);
      mockRequest = {
        log: jest.fn(),
        params: jest.fn().mockReturnValue({ uuid: uid })
      };
    });

    it(`sets HTTP method DELETE on /${ROUTE_NAME} path`, () => {
      expect(router.method).toBe('DELETE');
      expect(router.path).toBe(`/${ROUTE_NAME}/{uuid}`);
    });

    it('sets validation on request params', () => {
      const { params } = router.options.validate;
      expect(params.uuid).toBeDefined();
    });

    it(`sets response HTTP status code to ${statusCode} on success`, async () => {
      await router.handler(mockRequest, mockResponse);
      expect(mockStatusCode.mock.calls[0][0]).toBe(statusCode);
    });

    it('returns response data on success', async () => {
      await router.handler(mockRequest, mockResponse);
      expect(mockData.mock.calls[0][0]).toBe(responseData);
    });

    it('logs tagged request', async () => {
      await router.handler(mockRequest, mockResponse);
      expect(mockRequest.log.mock.calls[0][0]).toEqual([`/${ROUTE_NAME}`]);
    });
  });

  describe(`PUT /${ROUTE_NAME}`, () => {
    const router = updatePatient({ services, validate });
    const responseData = 'Patient entry modified';
    const statusCode = 200;
    let mockRequest: { log: JestMockT } = { log: null };
    let mockResponse = null;
    let mockData: JestMockT = null;
    let mockStatusCode: JestMockT = null;

    beforeEach(() => {
      mockData = jest.fn();
      mockStatusCode = jest.fn();

      mockResponse = {
        response: mockData,
        code: mockStatusCode,
      };
      mockData.mockImplementation(() => mockResponse);
      mockStatusCode.mockImplementation(() => mockResponse);
      mockRequest = {
        log: jest.fn(),
        params: jest.fn().mockReturnValue({ uuid: uid }),
        payload: jest.fn().mockReturnValue({
          role_id: 'cba7fd57-5d6b-4563-b60e-6c9f78f19579',
          email: 'test@test.com',
          password: 'pa33word',
          active: true,
        })
      };
    });

    it(`sets HTTP method PUT on /${ROUTE_NAME} path`, () => {
      expect(router.method).toBe('PUT');
      expect(router.path).toBe(`/${ROUTE_NAME}/{uuid}`);
    });

    it('sets validation on request payload and params', () => {
      const { payload } = router.options.validate;
      const { params } = router.options.validate;
      expect(params.uuid).toBeDefined();
      expect(payload).toBeDefined();
    });

    it(`sets response HTTP status code to ${statusCode} on success`, async () => {
      await router.handler(mockRequest, mockResponse);
      expect(mockStatusCode.mock.calls[0][0]).toBe(statusCode);
    });

    it('returns response data on success', async () => {
      await router.handler(mockRequest, mockResponse);
      expect(mockData.mock.calls[0][0]).toBe(responseData);
    });

    it('logs tagged request', async () => {
      await router.handler(mockRequest, mockResponse);
      expect(mockRequest.log.mock.calls[0][0]).toEqual([`/${ROUTE_NAME}`]);
    });
  });
});
