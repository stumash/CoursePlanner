import Enzyme, { shallow, render, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
// React 16 Enzyme adapter
Enzyme.configure({ adapter: new Adapter() });
// Make Enzyme functions available in all test files without importing
global.shallow = shallow;
global.render = render;
global.mount = mount;

global.cloneObject = (obj) => {
    return JSON.parse(JSON.stringify(obj));
};

// prevents ajax requests (and any other jquery functions) from actually firing
jest.mock('jquery');