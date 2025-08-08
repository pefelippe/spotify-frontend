import { ReactNode } from 'react';
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
    hasCustomButton?: boolean
}

export const DefaultPage = ({ title, subtitle, children, className, isLoading, error, loadingMessage, errorMessage, hasBackButton, hasCustomButton }: DefaultPageProps) => {
    if (isLoading) {
        return <PageWithQueryState isLoading={isLoading} error={error} loadingMessage={loadingMessage} errorMessage={errorMessage} />;
    }

    if (error) {
        return <PageWithQueryState isLoading={isLoading} error={error} loadingMessage={loadingMessage} errorMessage={errorMessage} />;
    }

    return (
        <div className={`min-h-[90vh] lg:min-h-screen bg-[#090707] w-full p-6 lg:p-10 ${className} min-w-[400px]`}>
            {hasBackButton && <BackButton artistName={title || 'Voltar'} />}
            {title && subtitle && <PageHeader title={title} subtitle={subtitle} />}
            {children}
        </div>
    );
};
