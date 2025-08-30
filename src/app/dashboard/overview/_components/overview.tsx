'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { debounce } from 'lodash';
import PageContainer from '@/components/layout/page-container';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface Book {
  key: string;
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  cover_i?: number;
  subject?: string[];
}

interface SearchResponse {
  docs: Book[];
  numFound: number;
}

const QUICK_FILTERS = ['science', 'mathematics', 'history', 'biology', 'astronomy'] as const;
const BOOKS_PER_PAGE = 20;
const CARD_HEIGHT = 350;
const SEARCH_DEBOUNCE_MS = 400;

export default function LibraryPage() {
  const parentRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  
  const [books, setBooks] = useState<Book[]>([]);
  const [query, setQuery] = useState<string>('science');
  const [inputValue, setInputValue] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);

  // Debounced search handler
  const debouncedSearch = useCallback(
    debounce((searchQuery: string) => {
      setQuery(searchQuery.trim() || 'science');
      setPage(1);
      setBooks([]);
      setHasMore(true);
    }, SEARCH_DEBOUNCE_MS),
    []
  );

  // Handle input change
  const handleInputChange = (value: string) => {
    setInputValue(value);
    debouncedSearch(value);
  };

  // Handle quick filter selection
  const handleQuickFilter = (filter: string) => {
    setInputValue(filter);
    setQuery(filter);
    setPage(1);
    setBooks([]);
    setHasMore(true);
  };

  // Fetch books from Open Library API
  const fetchBooks = useCallback(async (searchQuery: string, pageNum: number) => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(
        `https://openlibrary.org/search.json?q=${encodeURIComponent(
          searchQuery
        )}&page=${pageNum}&limit=${BOOKS_PER_PAGE}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch books');
      }

      const data: SearchResponse = await response.json();
      const newBooks = data.docs || [];
      
      setBooks(prevBooks => 
        pageNum === 1 ? newBooks : [...prevBooks, ...newBooks]
      );
      
      // Check if there are more pages
      setHasMore(newBooks.length === BOOKS_PER_PAGE);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Effect to fetch books when query or page changes
  useEffect(() => {
    fetchBooks(query, page);
  }, [fetchBooks, query, page]);

  // Infinite scroll observer
  useEffect(() => {
    const currentLoadMoreRef = loadMoreRef.current;
    if (!currentLoadMoreRef || !hasMore || loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPage(prevPage => prevPage + 1);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(currentLoadMoreRef);
    
    return () => {
      observer.disconnect();
    };
  }, [loading, hasMore]);

  // Virtual scrolling setup
  const rowVirtualizer = useVirtualizer({
    count: books.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => CARD_HEIGHT,
    overscan: 5,
  });

  // Helper function to get book cover URL
  const getCoverUrl = (coverId?: number): string | null => {
    return coverId 
      ? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`
      : null;
  };

  // Helper function to format authors
  const formatAuthors = (authors?: string[]): string => {
    if (!authors || authors.length === 0) return 'Unknown Author';
    return authors.slice(0, 2).join(', ');
  };

  return (
    <PageContainer scrollable>
      <div className="space-y-6">
        {/* Header and Search */}
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h1 className="text-3xl font-bold tracking-tight">Library</h1>
            <div className="relative">
              <Input
                placeholder="Search books..."
                value={inputValue}
                onChange={(e) => handleInputChange(e.target.value)}
                className="w-full md:w-80"
              />
            </div>
          </div>

          {/* Quick Filters */}
          <div className="flex gap-2 flex-wrap">
            {QUICK_FILTERS.map((filter) => (
              <Button
                key={filter}
                variant={filter === query ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleQuickFilter(filter)}
                className="capitalize"
              >
                {filter}
              </Button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        {books.length > 0 && (
          <p className="text-sm text-muted-foreground">
            Showing {books.length} books for "{query}"
          </p>
        )}

        {/* Virtualized Book Grid */}
        <div
          ref={parentRef}
          className="h-[calc(100vh-300px)] overflow-auto rounded-lg border"
        >
          <div
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
              position: 'relative',
            }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualItem) => {
              const book = books[virtualItem.index];
              if (!book) return null;

              const coverUrl = getCoverUrl(book.cover_i);
              const authors = formatAuthors(book.author_name);

              return (
                <div
                  key={book.key}
                  data-index={virtualItem.index}
                  ref={rowVirtualizer.measureElement}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    transform: `translateY(${virtualItem.start}px)`,
                  }}
                >
                  <Card className="mx-4 my-2 overflow-hidden transition-all duration-200 hover:shadow-lg hover:scale-[1.01]">
                    <div className="flex">
                      {/* Book Cover */}
                      <div className="relative w-32 h-48 flex-shrink-0">
                        {coverUrl ? (
                          <img
                            src={coverUrl}
                            alt={`Cover of ${book.title}`}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full bg-muted flex items-center justify-center">
                            <span className="text-xs text-muted-foreground text-center px-2">
                              No Cover
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Book Details */}
                      <div className="flex-1">
                        <CardHeader className="pb-2">
                          <CardTitle className="line-clamp-2 text-lg">
                            {book.title}
                          </CardTitle>
                          <CardDescription className="text-sm">
                            {authors}
                          </CardDescription>
                        </CardHeader>
                        
                        <CardContent className="pt-0">
                          {book.first_publish_year && (
                            <p className="text-sm text-muted-foreground mb-3">
                              First published: {book.first_publish_year}
                            </p>
                          )}
                          
                          {book.subject && book.subject.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {book.subject.slice(0, 4).map((subject, index) => (
                                <Badge 
                                  key={index} 
                                  variant="secondary" 
                                  className="text-xs"
                                >
                                  {subject}
                                </Badge>
                              ))}
                              {book.subject.length > 4 && (
                                <Badge variant="outline" className="text-xs">
                                  +{book.subject.length - 4} more
                                </Badge>
                              )}
                            </div>
                          )}
                        </CardContent>
                      </div>
                    </div>
                  </Card>
                </div>
              );
            })}
          </div>

          {/* Loading State and Infinite Scroll Sentinel */}
          {hasMore && (
            <div ref={loadMoreRef} className="h-20 flex items-center justify-center">
              {loading && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Loading more books...</span>
                </div>
              )}
            </div>
          )}

          {/* No More Results */}
          {!hasMore && books.length > 0 && (
            <div className="h-20 flex items-center justify-center">
              <p className="text-sm text-muted-foreground">
                No more books to load
              </p>
            </div>
          )}

          {/* Empty State */}
          {!loading && books.length === 0 && (
            <div className="h-64 flex items-center justify-center">
              <div className="text-center">
                <p className="text-lg font-medium text-muted-foreground">
                  No books found
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Try adjusting your search query
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
}