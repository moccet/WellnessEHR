import styles from './LoadingSkeleton.module.css';

interface LoadingSkeletonProps {
    variant?: 'text' | 'card' | 'chart' | 'metric';
    width?: string | number;
    height?: string | number;
    count?: number;
    className?: string;
}

export default function LoadingSkeleton({ 
    variant = 'text', 
    width, 
    height,
    count = 1,
    className = ''
}: LoadingSkeletonProps) {
    const getSkeletonStyle = () => {
        const baseStyle: React.CSSProperties = {
            width: width || '100%',
        };

        switch (variant) {
            case 'text':
                return { ...baseStyle, height: height || '16px' };
            case 'card':
                return { ...baseStyle, height: height || '120px' };
            case 'chart':
                return { ...baseStyle, height: height || '200px' };
            case 'metric':
                return { ...baseStyle, height: height || '80px' };
            default:
                return baseStyle;
        }
    };

    return (
        <>
            {Array.from({ length: count }).map((_, index) => (
                <div
                    key={index}
                    className={`${styles.skeleton} ${styles[variant]} ${className}`}
                    style={getSkeletonStyle()}
                />
            ))}
        </>
    );
}

export function LoadingGrid({ columns = 3, rows = 2 }: { columns?: number; rows?: number }) {
    return (
        <div className={styles.loadingGrid} style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
            {Array.from({ length: columns * rows }).map((_, index) => (
                <LoadingSkeleton key={index} variant="card" />
            ))}
        </div>
    );
}

export function LoadingList({ items = 5 }: { items?: number }) {
    return (
        <div className={styles.loadingList}>
            {Array.from({ length: items }).map((_, index) => (
                <div key={index} className={styles.loadingListItem}>
                    <LoadingSkeleton variant="text" width="30%" />
                    <LoadingSkeleton variant="text" width="70%" />
                </div>
            ))}
        </div>
    );
}