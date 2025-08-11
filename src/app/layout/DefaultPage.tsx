import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHorizontalSwipe } from '../../features/player/components/useSwipeGesture';
import { PageHeader } from './PageHeader';
import { PageWithQueryState } from '../components/PageWithQueryState';
import { BackButton } from './BackButton';

interface DefaultPageProps {
    title?: string
    subtitle?: string
    children: ReactNode
    className?: string
    isLoading?: boolean
    error?: any
    loadingMessage?: string
    errorMessage?: string
    hasBackButton?: boolean
}

export const DefaultPage = ({ title, subtitle, children, className, isLoading, error, loadingMessage, errorMessage, hasBackButton }: DefaultPageProps) => {
    const navigate = useNavigate();
    const swipeHandlers = useHorizontalSwipe<HTMLDivElement>(
        () => navigate(1),
        () => navigate(-1),
        {
            ignoreFromSelector: 'button, a, input, textarea, [role="button"], [data-swipe-ignore], .overflow-x-auto',
        }
    );
    if (isLoading) {
        return <PageWithQueryState isLoading={isLoading} error={error} loadingMessage={loadingMessage} errorMessage={errorMessage} />;
    }

    if (error) {
        return <PageWithQueryState isLoading={isLoading} error={error} loadingMessage={loadingMessage} errorMessage={errorMessage} />;
    }

    return (
        <div className={`min-h-[90vh] lg:min-h-screen bg-[#090707] w-full p-6 px-4 overflow-hidden ${className} min-w-[400px] animate-slide-in-left max-lg:mb-32`} {...swipeHandlers}>
            {hasBackButton && <BackButton artistName={title || 'Voltar'} />}
            {title && subtitle && <PageHeader title={title} subtitle={subtitle} />}
            {children}
        </div>
    );
};
