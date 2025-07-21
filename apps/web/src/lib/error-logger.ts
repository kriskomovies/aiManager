interface ErrorLogEntry {
  message: string;
  stack?: string;
  url: string;
  timestamp: Date;
  userAgent: string;
  userId?: string;
}

class ErrorLogger {
  private errors: ErrorLogEntry[] = [];

  logError(error: Error, context?: Record<string, unknown>) {
    const errorEntry: ErrorLogEntry = {
      message: error.message,
      stack: error.stack,
      url: window.location.href,
      timestamp: new Date(),
      userAgent: navigator.userAgent,
      ...context,
    };

    this.errors.push(errorEntry);

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error logged:', errorEntry);
    }

    // In production, you might want to send to an error tracking service
    // like Sentry, LogRocket, or your own backend
    if (process.env.NODE_ENV === 'production') {
      this.sendToErrorService(errorEntry);
    }
  }

  private async sendToErrorService(errorEntry: ErrorLogEntry) {
    try {
      // Example: Send to your backend or error tracking service
      // await fetch('/api/errors', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(errorEntry),
      // });

      console.warn('Error tracking not configured:', errorEntry);
    } catch (sendError) {
      console.error('Failed to send error to tracking service:', sendError);
    }
  }

  getErrors(): ErrorLogEntry[] {
    return [...this.errors];
  }

  clearErrors(): void {
    this.errors = [];
  }
}

export const errorLogger = new ErrorLogger();

// Global error handler for unhandled errors
window.addEventListener('error', event => {
  errorLogger.logError(new Error(event.message), {
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
  });
});

// Global handler for unhandled promise rejections
window.addEventListener('unhandledrejection', event => {
  errorLogger.logError(
    new Error(`Unhandled promise rejection: ${event.reason}`),
    { type: 'unhandledrejection' }
  );
});

export default errorLogger;
