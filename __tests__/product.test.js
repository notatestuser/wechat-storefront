/* eslint-env jest */

import React from 'react';
import renderer from 'react-test-renderer';
import { mount } from 'enzyme';
import { Icon } from 'antd';

import { Link } from '../routes';
import Product from '../components/Product';

describe('<Product />', () => {
  it('renders correctly', () => {
    const product = {
      description: 'Product Description',
      id: 'abc',
      thumbnail: 'https://lukep.org/placeholder.png',
      title: 'Product Title',
    };
    const component = renderer.create(<Product {...product} />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('links to the product page', () => {
    expect.assertions(2);
    const product = {
      description: 'Product Description',
      id: 'abc',
      thumbnail: 'https://lukep.org/placeholder.png',
      title: 'Product Title',
    };
    const component = mount(<Product {...product} />);
    component.find(Link).forEach(node => {
      const actualProps = node.props();
      expect(actualProps).toEqual({
        route: '/product/abc',
        prefetch: true,
        children: actualProps.children,
      });
    });
  });

  it('contains a wechat icon', () => {
    const component = mount(<Product />);
    const actual = component.contains(<Icon type="wechat" />);
    expect(actual).toEqual(true);
  });
});
