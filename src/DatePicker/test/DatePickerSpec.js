import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';
import { format, getHours, getMinutes, isSameDay, parseISO } from '../../utils/dateUtils';
import { getDOMNode, getInstance } from '@test/testUtils';

import DatePicker from '../DatePicker';
import { toTimeZone } from '../../utils/timeZone';

describe('DatePicker', () => {
  it('Should render a div with "rs-picker-date" class', () => {
    const instance = getDOMNode(<DatePicker />);
    assert.equal(instance.nodeName, 'DIV');
    assert.ok(instance.className.match(/\brs-picker-date\b/));
  });

  it('Should be disabled', () => {
    const instance = getDOMNode(<DatePicker disabled />);
    assert.ok(instance.className.match(/\bdisabled\b/));
  });

  it('Should be not cleanable', () => {
    const instance = getDOMNode(<DatePicker cleanable={false} value={new Date()} />);

    assert.ok(!instance.querySelector('.rs-picker-toggle-clean'));
  });

  it('Should output a button', () => {
    const instance = getInstance(<DatePicker toggleAs="button" />);
    assert.ok(ReactTestUtils.findRenderedDOMComponentWithTag(instance, 'button'));
  });

  it('Should be block', () => {
    const instance = getDOMNode(<DatePicker block />);

    assert.ok(instance.className.match(/\bblock\b/));
  });

  it('Should be inline', () => {
    const instance = getDOMNode(<DatePicker inline />);

    assert.ok(!instance.querySelector('.rs-picker-toggle'));
  });

  it('Should output a date', () => {
    const instance = getDOMNode(<DatePicker defaultValue={parseISO('2017-08-14')} />);
    assert.equal(instance.querySelector('.rs-picker-toggle-value').innerText, '2017-08-14');
  });

  it('Should output custom value', () => {
    const instance = getDOMNode(
      <DatePicker
        value={parseISO('2017-08-14')}
        renderValue={value => {
          return format(value, 'MM/dd/yyyy');
        }}
      />
    );

    assert.equal(instance.querySelector('.rs-picker-toggle-value').innerText, '08/14/2017');
  });

  it('Should output a date', () => {
    const instance = getDOMNode(<DatePicker value={parseISO('2017-08-14')} />);
    assert.equal(instance.querySelector('.rs-picker-toggle-value').innerText, '2017-08-14');
  });

  it('Should call `onChange` callback', done => {
    const doneOp = () => {
      done();
    };
    const instance = getInstance(<DatePicker onChange={doneOp} defaultOpen />);
    ReactTestUtils.Simulate.click(
      instance.menuContainerRef.current.querySelector('.rs-picker-toolbar-right-btn-ok')
    );
  });

  it('Should call `onClean` callback', done => {
    const doneOp = () => {
      done();
    };
    const instance = getDOMNode(<DatePicker defaultValue={new Date()} onClean={doneOp} />);
    ReactTestUtils.Simulate.click(instance.querySelector('.rs-picker-toggle-clean'));
  });

  it('Should call `onSelect` callback', done => {
    const doneOp = () => {
      done();
    };

    const instance = getInstance(<DatePicker onSelect={doneOp} defaultOpen />);

    ReactTestUtils.Simulate.click(
      instance.menuContainerRef.current.querySelector('.rs-calendar-table-cell-is-today')
    );
  });

  it('Should call `onOk` callback', done => {
    const doneOp = () => {
      done();
    };
    const instance = getInstance(<DatePicker onOk={doneOp} defaultOpen />);

    ReactTestUtils.Simulate.click(
      instance.menuContainerRef.current.querySelector('.rs-picker-toolbar-right-btn-ok')
    );
  });

  it('Should call `onNextMonth` callback', done => {
    const doneOp = () => {
      done();
    };

    const instance = getInstance(<DatePicker onNextMonth={doneOp} defaultOpen />);
    ReactTestUtils.Simulate.click(
      instance.menuContainerRef.current.querySelector('.rs-calendar-header-forward')
    );
  });

  it('Should call `onPrevMonth` callback', done => {
    const doneOp = () => {
      done();
    };

    const instance = getInstance(<DatePicker onPrevMonth={doneOp} defaultOpen />);
    ReactTestUtils.Simulate.click(
      instance.menuContainerRef.current.querySelector('.rs-calendar-header-backward')
    );
  });

  it('Should call `onToggleMonthDropdown` callback', done => {
    const doneOp = () => {
      done();
    };

    const instance = getDOMNode(
      <DatePicker onToggleMonthDropdown={doneOp} inline format="yyyy-MM-dd HH:mm:ss" />
    );
    ReactTestUtils.Simulate.click(instance.querySelector('.rs-calendar-header-title'));
  });

  it('Should call `onToggleTimeDropdown` callback', done => {
    const doneOp = () => {
      done();
    };

    const instance = getDOMNode(
      <DatePicker onToggleTimeDropdown={doneOp} inline format="yyyy-MM-dd HH:mm:ss" />
    );
    ReactTestUtils.Simulate.click(instance.querySelector('.rs-calendar-header-title-time'));
  });

  it('Should have a custom className', () => {
    const instance = getDOMNode(<DatePicker className="custom" />);
    assert.ok(instance.className.match(/\bcustom\b/));
  });

  it('Should have a custom style', () => {
    const fontSize = '12px';
    const instance = getDOMNode(<DatePicker style={{ fontSize }} />);
    assert.equal(instance.style.fontSize, fontSize);
  });

  it('Should call `onChangeCalendarDate` callback when click backward', done => {
    const doneOp = () => {
      done();
    };

    const instance = getInstance(<DatePicker onChangeCalendarDate={doneOp} defaultOpen />);

    ReactTestUtils.Simulate.click(
      instance.menuContainerRef.current.querySelector('.rs-calendar-header-backward')
    );
  });

  it('Should call `onChangeCalendarDate` callback when click forward', done => {
    const doneOp = () => {
      done();
    };

    const instance = getInstance(<DatePicker onChangeCalendarDate={doneOp} defaultOpen />);
    ReactTestUtils.Simulate.click(
      instance.menuContainerRef.current.querySelector('.rs-calendar-header-forward')
    );
  });

  it('Should call `onChangeCalendarDate` callback when click today ', done => {
    const doneOp = () => {
      done();
    };

    const instance = getInstance(<DatePicker onChangeCalendarDate={doneOp} defaultOpen />);
    ReactTestUtils.Simulate.click(
      instance.menuContainerRef.current.querySelector('.rs-calendar-table-cell-is-today')
    );
  });

  it('Should call `onOpen` callback', done => {
    const doneOp = () => {
      done();
    };
    const picker = getInstance(<DatePicker onOpen={doneOp} />);
    picker.open();
  });

  it('Should call `onClose` callback', done => {
    const doneOp = () => {
      done();
    };
    const picker = getInstance(<DatePicker defaultOpen onClose={doneOp} />);
    picker.close();
  });

  it('Should not change for the value  when it is controlled', done => {
    let instance = null;
    const doneOp = () => {
      if (
        getDOMNode(instance).querySelector('.rs-picker-toggle-value').innerText === '2018-01-05'
      ) {
        done();
      }
    };

    instance = getInstance(
      <DatePicker value={parseISO('2018-01-05')} onChange={doneOp} defaultOpen />
    );

    const allCells = instance.menuContainerRef.current.querySelectorAll('.rs-calendar-table-cell');

    ReactTestUtils.Simulate.click(allCells[allCells.length - 1]);
    ReactTestUtils.Simulate.click(
      instance.menuContainerRef.current.querySelector('.rs-picker-toolbar-right-btn-ok')
    );
  });

  it('Should call onBlur callback', done => {
    const doneOp = () => {
      done();
    };
    const instance = getDOMNode(<DatePicker onBlur={doneOp} />);

    const toggle = instance.querySelector('.rs-picker-toggle');

    ReactTestUtils.Simulate.blur(toggle);
  });

  it('Should call onFocus callback', done => {
    const doneOp = () => {
      done();
    };
    const instance = getDOMNode(<DatePicker onFocus={doneOp} />);
    const toggle = instance.querySelector('.rs-picker-toggle');

    ReactTestUtils.Simulate.focus(toggle);
  });

  it('Should have a custom className prefix', () => {
    const instance = getDOMNode(<DatePicker classPrefix="custom-prefix" />);
    assert.ok(instance.className.match(/\bcustom-prefix\b/));
  });

  it('Should call onChange after setting oneTap', done => {
    const doneOp = value => {
      if (isSameDay(value, new Date())) {
        done();
      }
    };
    const instance = getInstance(<DatePicker onChange={doneOp} oneTap defaultOpen />);

    const today = instance.menuContainerRef.current.querySelector(
      '.rs-calendar-table-cell-is-today'
    );

    ReactTestUtils.Simulate.click(today);
  });

  it('Should be show meridian', () => {
    const instance = getInstance(
      <DatePicker
        value={parseISO('2017-08-14 13:00:00')}
        format="dd MMM yyyy hh:mm:ss a"
        defaultOpen
        showMeridian
      />
    );

    const picker = instance.menuContainerRef.current;

    assert.equal(picker.querySelector('.rs-calendar-header-meridian').innerText, 'PM');
    assert.equal(picker.querySelector('.rs-calendar-header-title-time').innerText, '01:00:00');
    assert.equal(
      picker.querySelector('.rs-calendar-time-dropdown-column').querySelectorAll('li').length,
      12
    );
    assert.equal(picker.querySelector('.rs-calendar-time-dropdown-column li').innerText, '12');
  });

  it('Should be zoned date', () => {
    const timeZone = new Date().getTimezoneOffset() === -480 ? 'Europe/London' : 'Asia/Shanghai';
    const template = 'yyyy-MM-dd HH:mm:ss';
    const date = new Date(2020, 5, 30, 23, 30, 0);
    const instance = getInstance(
      <DatePicker format={template} timeZone={timeZone} value={date} defaultOpen />
    );
    const ret = getDOMNode(instance).querySelector('.rs-picker-toggle-value').innerHTML;

    assert.equal(ret, format(toTimeZone(date, timeZone), template));
  });

  it('Should `disabledDate` callback params is correct in zoned date', function () {
    const timeZone = new Date().getTimezoneOffset() === -480 ? 'Europe/London' : 'Asia/Shanghai';
    const template = 'yyyy-MM-dd HH:mm:ss';
    const date = new Date();
    const dateFormatted = format(date, 'HH:mm');
    const instance = getInstance(
      <DatePicker
        format={template}
        timeZone={timeZone}
        defaultOpen
        value={date}
        disabledDate={value => {
          assert.equal(format(value, 'HH:mm'), dateFormatted);
          return value.valueOf() > date.valueOf();
        }}
      />
    );
  });

  it('Should `disabledHours` `disabledMinutes` `disabledSecond` callback params is correct in zoned date', function () {
    const timeZone = new Date().getTimezoneOffset() === -480 ? 'Europe/London' : 'Asia/Shanghai';
    const template = 'yyyy-MM-dd HH:mm:ss';
    const timeTemplate = 'HH:mm:ss';
    const dateFormatted = format(new Date(), timeTemplate);
    const disabledOrHideTimeFunc = (next, date) => {
      assert.equal(format(date, timeTemplate), dateFormatted);
      return true;
    };
    const instance = getInstance(
      <DatePicker
        format={template}
        timeZone={timeZone}
        defaultOpen
        disabledHours={disabledOrHideTimeFunc}
        disabledMinutes={disabledOrHideTimeFunc}
        disabledSeconds={disabledOrHideTimeFunc}
        hideHours={disabledOrHideTimeFunc}
        hideMinutes={disabledOrHideTimeFunc}
        hideSeconds={disabledOrHideTimeFunc}
      />
    );
  });
});
