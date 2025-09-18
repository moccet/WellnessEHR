import { useEffect, useState } from 'react';

export function usePageTransition() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Trigger animation after component mount
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 10);

        return () => clearTimeout(timer);
    }, []);

    return isVisible;
}

export function useStaggeredAnimation(itemCount: number, baseDelay: number = 0) {
    const [visibleItems, setVisibleItems] = useState<boolean[]>(
        new Array(itemCount).fill(false)
    );

    useEffect(() => {
        const timers: NodeJS.Timeout[] = [];

        for (let i = 0; i < itemCount; i++) {
            timers.push(
                setTimeout(() => {
                    setVisibleItems(prev => {
                        const newState = [...prev];
                        newState[i] = true;
                        return newState;
                    });
                }, baseDelay + (i * 100)) // 100ms delay between each item for calmer stagger
            );
        }

        return () => {
            timers.forEach(timer => clearTimeout(timer));
        };
    }, [itemCount, baseDelay]);

    return visibleItems;
}

export function useFadeIn(delay: number = 0) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, delay);

        return () => clearTimeout(timer);
    }, [delay]);

    return {
        style: {
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(12px)',
            transition: 'opacity 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        }
    };
}