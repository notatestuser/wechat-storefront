import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Router from 'next/router';

const mockedRouter = { push: () => {}, prefetch: () => {} };
Router.router = mockedRouter;

configure({ adapter: new Adapter() });
