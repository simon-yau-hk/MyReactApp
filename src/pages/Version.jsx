import React from 'react';
import versionInfo from '~/version.json';

const Version = () => {
    return (
        <div className="version">
            Version: {versionInfo.version}
        </div>
    );
};

export default Version;