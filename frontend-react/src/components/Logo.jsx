import logoMonogram from '../assets/logo/logo-monogram.svg';
import logoRafael from '../assets/logo/logo-rafael.svg';
import logoUnderline from '../assets/logo/logo-underline.svg';
import logoModa from '../assets/logo/logo-moda.svg';

const layers = [logoMonogram, logoRafael, logoUnderline, logoModa];

function Logo() {
    return (
        <span className="app-logo" role="img" aria-label="Rafael Moda">
            {layers.map((src) => (
                <img key={src} className="app-logo-layer" src={src} alt="" />
            ))}
        </span>
    );
}

export default Logo;