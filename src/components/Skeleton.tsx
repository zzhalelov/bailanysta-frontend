import React from 'react';

export const SkeletonPost: React.FC = () => {
    return (
        <div className="card skeleton-card">
            <div className="skeleton-header">
                <div className="skeleton-avatar"></div>
                <div className="skeleton-lines">
                    <div className="skeleton-line short"></div>
                    <div className="skeleton-line mini"></div>
                </div>
            </div>
            <div className="skeleton-body">
                <div className="skeleton-line full"></div>
                <div className="skeleton-line medium"></div>
            </div>
        </div>
    );
};