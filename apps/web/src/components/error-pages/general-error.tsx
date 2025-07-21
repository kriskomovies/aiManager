import { useRouteError, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';

export function GeneralErrorPage() {
  const error = useRouteError() as {
    status?: number;
    statusText?: string;
    message?: string;
  };
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  const handleReload = () => {
    window.location.reload();
  };

  const getErrorMessage = () => {
    if (error?.status === 404) {
      return {
        title: 'Страницата не е намерена',
        message:
          'Страницата, която търсите, не съществува или е била преместена.',
      };
    }

    if (error?.status && error.status >= 500) {
      return {
        title: 'Сървърна грешка',
        message:
          'Възникна проблем със сървъра. Моля, опитайте отново по-късно.',
      };
    }

    return {
      title: 'Възникна грешка',
      message:
        error?.statusText || error?.message || 'Възникна неочаквана грешка.',
    };
  };

  const { title, message } = getErrorMessage();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-center mb-6">
            <div className="bg-red-100 p-4 rounded-full">
              <AlertTriangle className="h-12 w-12 text-red-500" />
            </div>
          </div>

          {error?.status && (
            <h1 className="text-6xl font-bold text-gray-900 mb-4">
              {error.status}
            </h1>
          )}

          <h2 className="text-2xl font-semibold text-gray-900 mb-2">{title}</h2>

          <p className="text-gray-600 mb-8">{message}</p>

          {process.env.NODE_ENV === 'development' && error && (
            <div className="bg-gray-100 p-4 rounded-lg mb-6 text-left">
              <h3 className="font-semibold text-gray-900 mb-2">
                Техническа информация:
              </h3>
              <pre className="text-xs text-gray-700 overflow-auto">
                {JSON.stringify(error, null, 2)}
              </pre>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={handleReload} className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Опитай отново
            </Button>

            <Button onClick={handleGoHome} className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Към началото
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
