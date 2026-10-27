describe("Chat message length configuration", () => {
  const ENV_KEY = "CHAT_MAX_MESSAGE_LENGTH";
  const originalValue = process.env[ENV_KEY];

  afterEach(() => {
    if (originalValue === undefined) {
      delete process.env[ENV_KEY];
    } else {
      process.env[ENV_KEY] = originalValue;
    }

    jest.resetModules();
  });

  test("defaults to 2000 characters", () => {
    delete process.env[ENV_KEY];
    jest.resetModules();

    const { MAX_MESSAGE_LENGTH } = require("../routes/chat");
    expect(MAX_MESSAGE_LENGTH).toBe(2000);
  });

  test("accepts a configured limit of 4000", () => {
    process.env[ENV_KEY] = "4000";
    jest.resetModules();

    const { MAX_MESSAGE_LENGTH } = require("../routes/chat");
    expect(MAX_MESSAGE_LENGTH).toBe(4000);
  });

  test("falls back to 2000 for invalid configuration", () => {
    process.env[ENV_KEY] = "invalid";
    jest.resetModules();

    const { MAX_MESSAGE_LENGTH } = require("../routes/chat");
    expect(MAX_MESSAGE_LENGTH).toBe(2000);
  });

  test("falls back to 2000 for values below 2000", () => {
    process.env[ENV_KEY] = "500";
    jest.resetModules();

    const { MAX_MESSAGE_LENGTH } = require("../routes/chat");
    expect(MAX_MESSAGE_LENGTH).toBe(2000);
  });
});