import React from "react";
import Enzyme, {mount, shallow} from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import {ONSCheckbox} from "./ONSCheckbox";
import {WebDriver} from "selenium-webdriver";

describe("ONS Checkbox Test", () => {
    Enzyme.configure({adapter: new Adapter()});

    const Props = {
        id: '12',
        onCheckboxClick: jest.fn(),
    };

    const checkboxWithLabelProps = {
        label: "Enable",
        id: '12',
        onCheckboxClick: jest.fn(),
        checked: true
    };

    const checkboxCheckedProps = {
        label: "Enable",
        id: '12',
        checked: true,
    };

    function wrapper(render: any, props: any) {
        return render(
            <ONSCheckbox id={props.id}
                         label={props.label}
                         onChange={props.onCheckboxClick}
                         disabled={props.disabled}
                         checked={props.checked}
                         style={props.style}/>)
    }
    
    let url = 'http://localhost:3000';
    let browser: WebDriver;

    // beforeEach(async  () => browser = await new Builder().forBrowser('chrome').build())

    // afterEach(async () => {
    //     if (browser !== undefined) {
    //         await browser.quit();
    //     }
    // });

    it("matches Snapshot", () => {
        expect(wrapper(shallow, Props)).toMatchSnapshot()
    });

    it("should render correctly", () => expect(wrapper(shallow, Props).exists()).toEqual(true));

    it("should render with the correct label", () => {
        expect(wrapper(mount, checkboxWithLabelProps).find("ONSCheckbox").getElement().props.label).toEqual(checkboxWithLabelProps.label);
    });

    it("should render without label if prop not passed in", () => {
            expect(wrapper(mount, Props).find("ONSCheckbox").getElement().props.label).toBeUndefined();
        }
    );

    it("should render with the correct checked status", () => {
        expect(wrapper(mount, checkboxCheckedProps).find("ONSCheckbox").getElement().props.checked).toEqual(true);
    });

    it('simulates change events', () => {
        //For no label
        wrapper(mount, Props).find('input').simulate('change')
        expect(Props.onCheckboxClick).toHaveBeenCalled()

        //For with label
        wrapper(mount, checkboxWithLabelProps).find('input').simulate('change')
        expect(checkboxWithLabelProps.onCheckboxClick).toHaveBeenCalled()
    });

    

    // it('matches snapshot', () => {
    //     expect(wrapper(mount, checkboxProps)).toMatchSnapshot()
    // });
});