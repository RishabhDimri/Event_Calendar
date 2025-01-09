import { Calendar } from '@/components/Calendar';
import { SearchAndExport } from '@/components/SearchAndExport';
import { useEvents } from '@/hooks/useEvents';

function App() {
  const { setSearchTerm, exportEvents } = useEvents();

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleExport = (format: 'json' | 'csv') => {
    exportEvents(format);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 p-6">
      <div className="w-full max-w-4xl bg-white dark:bg-gray-800 rounded-lg shadow-2xl overflow-hidden">
        <header className="text-center p-6">
          <h1 className="text-5xl font-bold">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
              Event Calendar
            </span>
          </h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
            Organize your schedule effortlessly
          </p>
        </header>

        <main className="p-6 space-y-6">
          <div>
            <SearchAndExport onSearch={handleSearch} onExport={handleExport} />
          </div>
          <div>
            <Calendar />
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
