import TypeDialog from './TypeDialog.jsx';
import EditionDialog from './EditionDialog.jsx';

function ModalComponent({ data = {}, type, ...props }) {
    const Dialog = type === 'seasonTypes' || type === 'campaignTypes' ? TypeDialog : EditionDialog;
    return <Dialog data={data} type={type} {...props} />;
}

export default ModalComponent;