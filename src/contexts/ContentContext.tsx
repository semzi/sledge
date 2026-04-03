import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiUrl } from '../lib/api';

type ContentData = {
  programs: any;
  about: any;
  futureForward: any;
  [key: string]: any;
};

type ContentContextType = {
  content: ContentData | null;
  loading: boolean;
  error: string | null;
  refreshContent: () => Promise<void>;
};

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<ContentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContent = async () => {
    try {
      const res = await fetch(apiUrl('/content.php'));
      if (!res.ok) throw new Error('Failed to fetch content');
      const data = await res.json();
      setContent(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  return (
    <ContentContext.Provider value={{ content, loading, error, refreshContent: fetchContent }}>
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => {
  const context = useContext(ContentContext);
  if (context === undefined) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};
