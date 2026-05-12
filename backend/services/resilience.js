class TimeoutError extends Error {
    constructor(serviceName, timeoutMs) {
        super(`${serviceName} timed out after ${timeoutMs}ms`);
        this.name = "TimeoutError";
        this.serviceName = serviceName;
        this.timeoutMs = timeoutMs;
    }
}

function wait(ms, signal) {
    if (ms <= 0) return Promise.resolve();

    return new Promise((resolve, reject) => {
        const timer = setTimeout(resolve, ms);
        if (signal) {
            signal.addEventListener("abort", () => {
                clearTimeout(timer);
                reject(signal.reason || new Error("Operation aborted"));
            }, { once: true });
        }
    });
}

async function withTimeout(serviceName, timeoutMs, task) {
    const controller = new AbortController();
    let timeoutError;
    const timer = setTimeout(() => {
        timeoutError = new TimeoutError(serviceName, timeoutMs);
        controller.abort(timeoutError);
    }, timeoutMs);

    try {
        return await Promise.race([
            task(controller.signal),
            new Promise((_, reject) => {
                controller.signal.addEventListener("abort", () => {
                    reject(timeoutError || new TimeoutError(serviceName, timeoutMs));
                }, { once: true });
            })
        ]);
    } catch (error) {
        if (controller.signal.aborted) {
            throw controller.signal.reason || new TimeoutError(serviceName, timeoutMs);
        }
        throw error;
    } finally {
        clearTimeout(timer);
    }
}

async function retryWithTimeout(serviceName, task, options = {}) {
    const {
        retries = 1,
        timeoutMs = 3000,
        retryDelayMs = 100
    } = options;

    let lastError;

    for (let attempt = 0; attempt <= retries; attempt += 1) {
        try {
            return await withTimeout(serviceName, timeoutMs, signal =>
                task({ signal, attempt })
            );
        } catch (error) {
            lastError = error;
            if (attempt >= retries) break;
            await wait(retryDelayMs * (attempt + 1));
        }
    }

    throw lastError;
}

async function runService(config) {
    const {
        name,
        enabled = true,
        execute,
        retries = 1,
        timeoutMs = 3000,
        retryDelayMs = 100
    } = config;

    const startedAt = Date.now();

    if (!enabled) {
        return {
            name,
            status: "disabled",
            durationMs: 0,
            results: [],
            error: null
        };
    }

    try {
        const output = await retryWithTimeout(name, execute, { retries, timeoutMs, retryDelayMs });
        return {
            name,
            status: "fulfilled",
            durationMs: Date.now() - startedAt,
            results: Array.isArray(output) ? output : output?.results || [],
            metadata: output?.metadata || {},
            error: null
        };
    } catch (error) {
        return {
            name,
            status: error?.name === "TimeoutError" ? "timed_out" : "failed",
            durationMs: Date.now() - startedAt,
            results: [],
            error: {
                name: error?.name || "Error",
                message: error?.message || String(error)
            }
        };
    }
}

module.exports = {
    TimeoutError,
    retryWithTimeout,
    runService,
    wait,
    withTimeout
};
