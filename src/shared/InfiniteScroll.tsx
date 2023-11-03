import React, { useState, useEffect, useRef, ReactNode } from 'react';

type PropInfiniteScroll = {
  loadMore: () => void;
  hasMore: boolean;
  isLoading?: boolean;
  threshold: number;
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
};

const InfiniteScroll = ({
  loadMore,
  isLoading,
  hasMore,
  threshold = 10,
  children,
  className,
  style,
}: PropInfiniteScroll) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;

    const handleScroll = () => {
      if (
        container?.scrollTop! + container?.clientHeight! >=
          container?.scrollHeight! - threshold &&
        !isLoading &&
        hasMore
      ) {
        loadMore();
      }
    };

    container?.addEventListener('scroll', handleScroll);

    return () => {
      container?.removeEventListener('scroll', handleScroll);
    };
  }, [loadMore, isLoading, hasMore, threshold]);

  return (
    <div ref={containerRef} className={className} style={style}>
      {children}
      {isLoading && <div>Loading...</div>}
      {!hasMore && <div>No more items</div>}
    </div>
  );
};

export default InfiniteScroll;
