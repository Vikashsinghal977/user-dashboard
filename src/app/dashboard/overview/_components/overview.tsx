'use client';

import { useState, useEffect, useCallback } from 'react';
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
import { Loader2, BookOpen, BookMarked } from 'lucide-react';
import Cardtable from './card-details/cards-sections';
import { useRouter } from 'next/navigation';

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
const BOOKS_PER_PAGE = 9;
const SEARCH_DEBOUNCE_MS = 400;

export default function LibraryPage() {
  const router = useRouter();
  const [books, setBooks] = useState<Book[]>([]);
  const [query, setQuery] = useState<string>('science');
  const [inputValue, setInputValue] = useState<string>('science');
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [enrolledBooks, setEnrolledBooks] = useState<Set<string>>(new Set());
  const [enrollingBooks, setEnrollingBooks] = useState<Set<string>>(new Set());

  // Debounced search handler
  const debouncedSearch = useCallback(
    debounce((searchQuery: string) => {
      const trimmedQuery = searchQuery.trim() || 'science';
      setQuery(trimmedQuery);
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
  const fetchBooks = useCallback(async (searchQuery: string, pageNum: number, isLoadMore = false) => {
    if (!searchQuery.trim()) return;

    if (isLoadMore) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }

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
      setLoadingMore(false);
    }
  }, []);

  // Effect to fetch books when query changes
  useEffect(() => {
    fetchBooks(query, 1);
  }, [fetchBooks, query]);

  // Handle load more
  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchBooks(query, nextPage, true);
  };

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

  // Handle book enrollment
  const handleEnrollment = async (bookKey: string, bookTitle: string) => {
    if (enrolledBooks.has(bookKey)) {
      // Unenroll
      setEnrolledBooks(prev => {
        const newSet = new Set(prev);
        newSet.delete(bookKey);
        return newSet;
      });
    } else {
      // Enroll
      setEnrollingBooks(prev => new Set(prev).add(bookKey));
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setEnrolledBooks(prev => new Set(prev).add(bookKey));
      setEnrollingBooks(prev => {
        const newSet = new Set(prev);
        newSet.delete(bookKey);
        return newSet;
      });

      router.push(`/dashboard/enroll?bookKey=${bookKey}&bookTitle=${encodeURIComponent(bookTitle)}`);
    }
  };

  return (
    <PageContainer scrollable>
      <div className="space-y-6">
        {/* Header and Search */}
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <BookOpen className="h-8 w-8" />
              <h1 className="text-3xl font-bold tracking-tight">Library</h1>
            </div>
            <div className="relative">
              <Input
                placeholder="Search books..."
                value={inputValue}
                onChange={(e) => handleInputChange(e.target.value)}
                className="w-full md:w-80"
                disabled={loading}
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
                disabled={loading}
              >
                {filter}
              </Button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        {books.length > 0 && !loading && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {books.length} books for "{query}"
            </p>
            {enrolledBooks.size > 0 && (
              <p className="text-sm text-green-600 font-medium">
                {enrolledBooks.size} book{enrolledBooks.size === 1 ? '' : 's'} enrolled
              </p>
            )}
          </div>
        )}

        {/* Loading State for Initial Load */}
        {loading && books.length === 0 && (
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Searching for books...</span>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && books.length === 0 && query && (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-lg font-medium text-muted-foreground">
                No books found
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Try adjusting your search query or browse our categories
              </p>
            </div>
          </div>
        )}

        {/* Books Grid */}
        {books.length > 0 && (
          <div className="space-y-6">
            <Cardtable data={books}  enrolledBooks={enrolledBooks} enrollingBooks={enrollingBooks}handleEnrollment={handleEnrollment} />

            {/* Load More Button */}
            {hasMore && (
              <div className="flex justify-center pt-4">
                <Button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  size="lg"
                  className="min-w-32"
                >
                  {loadingMore ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    'Load More Books'
                  )}
                </Button>
              </div>
            )}

            {/* End of Results */}
            {!hasMore && books.length >= BOOKS_PER_PAGE && (
              <div className="text-center pt-4">
                <p className="text-sm text-muted-foreground">
                  You've reached the end of the results
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </PageContainer>
  );
}