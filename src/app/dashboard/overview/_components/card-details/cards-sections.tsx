import PageContainer from "@/components/layout/page-container";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, BookMarked, Loader2 } from "lucide-react";

interface Book {
  key: string;
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  cover_i?: number;
  subject?: string[];
}

interface CardtableProps {
  data: Book[];
  enrolledBooks?: Set<string>;
  enrollingBooks?: Set<string>;
  handleEnrollment?: (bookKey: string, bookTitle: string) => void;
}

export default function Cardtable({ 
  data, 
  enrolledBooks = new Set(), 
  enrollingBooks = new Set(),
  handleEnrollment 
}: CardtableProps) {
  
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((book) => {
            const coverUrl = getCoverUrl(book.cover_i);
            const authors = formatAuthors(book.author_name);
            const isEnrolled = enrolledBooks.has(book.key);
            const isEnrolling = enrollingBooks.has(book.key);

            return (
              <Card
                key={book.key} 
                className="overflow-hidden transition-all duration-200 hover:shadow-lg hover:scale-[1.02] group"
              >
                {/* Book Cover */}
                <div className="relative w-full h-64 overflow-hidden">
                  {coverUrl ? (
                    <img
                      src={coverUrl}
                      alt={`Cover of ${book.title}`}
                      className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                      <div className="text-center p-4">
                        <BookOpen className="h-12 w-12 mx-auto text-slate-400 mb-2" />
                        <span className="text-sm text-slate-500">No Cover Available</span>
                      </div>
                    </div>
                  )}
                  {/* Publication Year Badge */}
                  {book.first_publish_year && (
                    <div className="absolute top-3 right-3">
                      <Badge variant="secondary" className="bg-white/90 text-black">
                        {book.first_publish_year}
                      </Badge>
                    </div>
                  )}
                  {/* Enrolled Badge */}
                  {isEnrolled && (
                    <div className="absolute top-3 left-3">
                      <Badge variant="default" className="bg-green-600">
                        <BookMarked className="w-3 h-3 mr-1" />
                        Enrolled
                      </Badge>
                    </div>
                  )}
                </div>

                {/* Book Details */}
                <CardHeader className="pb-2">
                  <CardTitle className="line-clamp-2 text-base leading-tight">
                    {book.title}
                  </CardTitle>
                  <CardDescription className="text-sm">
                    {authors}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="pt-0 space-y-3">
                  {book.subject && book.subject.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {book.subject.slice(0, 2).map((subject, index) => (
                        <Badge 
                          key={index} 
                          variant="outline" 
                          className="text-xs"
                        >
                          {subject.length > 15 ? `${subject.substring(0, 15)}...` : subject}
                        </Badge>
                      ))}
                      {book.subject.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{book.subject.length - 2}
                        </Badge>
                      )}
                    </div>
                  )}

                  {/* Enrollment Button */}
                  {handleEnrollment && (
                    <Button
                      onClick={() => handleEnrollment(book.key, book.title)}
                      disabled={isEnrolling}
                      variant={isEnrolled ? "secondary" : "default"}
                      className={`w-full ${isEnrolled ? 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100' : ''}`}
                      size="sm"
                    >
                      {isEnrolling ? (
                        <>
                          <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                          Enrolling...
                        </>
                      ) : isEnrolled ? (
                        <>
                          <BookMarked className="mr-2 h-3 w-3" />
                          Enrolled
                        </>
                      ) : (
                        <>
                          <BookOpen className="mr-2 h-3 w-3" />
                          Enroll Now
                        </>
                      )}
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </PageContainer>
  );
}   