import { FormattedMessage } from 'react-intl';

function WelcomeComp() {
    return (
        <>
            <div>
                <FormattedMessage id="welcome.message" />
            </div>
        </>
    )
}

export default WelcomeComp;