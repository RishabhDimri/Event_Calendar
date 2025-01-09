import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {  Search, FileJson, FileSpreadsheet } from 'lucide-react';

interface SearchAndExportProps {
  onSearch: (term: string) => void;
  onExport: (format: 'json' | 'csv') => void;
}

export function SearchAndExport({ onSearch, onExport }: SearchAndExportProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
      <div className="relative w-full sm:w-auto">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search events..."
          className="pl-9 w-full sm:w-[300px] bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>
      <div className="flex gap-3 w-full sm:w-auto">
        <Button
          variant="outline"
          size="default"
          onClick={() => onExport('json')}
          className="flex-1 sm:flex-none bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          <FileJson className="h-4 w-4 mr-2" />
          JSON
        </Button>
        <Button
          variant="outline"
          size="default"
          onClick={() => onExport('csv')}
          className="flex-1 sm:flex-none bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:text-green-600 dark:hover:text-green-400 transition-colors"
        >
          <FileSpreadsheet className="h-4 w-4 mr-2" />
          CSV
        </Button>
      </div>
    </div>
  );
}
