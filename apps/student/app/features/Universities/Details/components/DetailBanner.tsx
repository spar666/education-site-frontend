import React from 'react';

interface DetailBannerProps {
    height?: string;
    imageUrl: string;
    component: React.ReactNode;
}

const DetailBanner: React.FC<DetailBannerProps> = ({
    height = "h-96",
    imageUrl,
    component
}) => {
    return (
        <div className={`relative w-full ${height} overflow-hidden bg-slate-900`}>
            {/* Background Image */}
            <img
                src={imageUrl}
                alt="Banner"
                className="absolute inset-0 w-full h-full object-cover opacity-60"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent" />

            {/* Content Injection */}
            <div className="relative h-full w-full">
                {component}
            </div>
        </div>
    );
};

export default DetailBanner;
