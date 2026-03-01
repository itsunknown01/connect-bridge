import { Button, Input } from "@/src/client/components/ui";
import { useDebounce } from "@/src/client/hooks/customs/useDebounce";
import { useMessageStore } from "@/src/client/stores/message-store";
import { useSearchMessages } from "@/src/client/hooks/api/use-message-queries";
import { Loader2, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

interface SearchBarProps {
  channelId: string;
  onClose: () => void;
  onResultClick?: (messageId: string) => void;
}

export default function SearchBar({
  onClose,
  channelId,
  onResultClick,
}: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const { mutate: searchMutate } = useSearchMessages();
  const { searchLoading, searchResults, clearSearchResults } =
    useMessageStore();

  const debouncedQuery = useDebounce(searchQuery, 500);

  const performSearch = useCallback(
    (query: string) => {
      if (!query.trim() || !channelId) {
        clearSearchResults();
        setShowResults(false);
        return;
      }

      searchMutate({
        channelId,
        query: query.trim(),
        limit: 10,
      });
      setShowResults(true);
    },
    [channelId, clearSearchResults, searchMutate],
  );

  useEffect(() => {
    performSearch(debouncedQuery);
  }, [debouncedQuery, performSearch]);

  useEffect(() => {
    return () => {
      clearSearchResults();
    };
  }, [clearSearchResults]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      performSearch(searchQuery);
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  const handleClose = () => {
    clearSearchResults();
    setSearchQuery("");
    setShowResults(false);
    onClose();
  };

  const handleResultClick = (messageId: string) => {
    onResultClick?.(messageId);
    handleClose();
  };

  const results = searchResults || [];

  return (
    <div className="relative w-72">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Input
            placeholder="Search messages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            className="h-9 text-sm border-[#ADBC9F]/30"
            aria-label="Search messages"
          />
          {searchLoading && (
            <Loader2 className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-[#ADBC9F]" />
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleClose}
          className="text-[#ADBC9F] hover:text-[#12372A] hover:bg-[#ADBC9F]/10"
          aria-label="Close search"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      {showResults && results.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
          <div className="p-2">
            <p className="text-xs text-gray-500 px-2 py-1 font-medium">
              {results.length} result{results.length !== 1 ? "s" : ""} found
            </p>
            <div className="space-y-1">
              {results.map((result) => (
                <button
                  key={result.id}
                  onClick={() => handleResultClick(String(result.id))}
                  className="w-full text-left p-3 rounded-lg hover:bg-[#ADBC9F]/10 transition-colors"
                >
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-sm font-semibold text-[#12372A]">
                      {result.authorName}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(result.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 line-clamp-2">
                    {result.content}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {showResults &&
        results.length === 0 &&
        !searchLoading &&
        searchQuery.trim() && (
          <div className="absolute top-full mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50">
            <p className="text-sm text-gray-500 text-center">
              No messages found
            </p>
          </div>
        )}
    </div>
  );
}
