// https://www.dhiwise.com/post/mastering-react-slot-patterns-for-flexible-ui-components

import './modal.css';

export interface modalProps {
    title: string;
    close: () => void;
    content: JSX.Element;
    actions: JSX.Element;
}

function Modal({ title, content, actions, close }: modalProps) {
    return (
        <>
            <div id="default-modal" className="overflow-y-auto overflow-x-hidden fixed inset-0 z-50 flex justify-center items-center">
                <div className="relative p-4 w-full max-w-2xl max-h-full">
                    <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                        <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                {title}
                            </h3>
                            <button onClick={close} type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="default-modal">
                                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                </svg>
                                <span className="sr-only">Close modal</span>
                            </button>
                        </div>
                        <div className="p-4 md:p-5 space-y-4">
                            {content}
                        </div>
                        <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                            {actions}
                        </div>
                    </div>
                </div>
            </div>
            <div className='modal-overlay' />
        </>
    );
}

export default Modal;