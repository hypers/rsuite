import React, { useRef, useState, useCallback, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';
import clone from 'lodash/clone';
import isUndefined from 'lodash/isUndefined';
import isFunction from 'lodash/isFunction';
import remove from 'lodash/remove';
import omit from 'lodash/omit';
import pick from 'lodash/pick';
import { filterNodesOfTree } from '../utils/treeUtils';
import {
  createChainedFunction,
  getDataGroupBy,
  useClassNames,
  shallowEqual,
  useCustom
} from '../utils';
import {
  DropdownMenu,
  DropdownMenuCheckItem as DropdownMenuItem,
  PickerToggle,
  MenuWrapper,
  SearchBar,
  SelectedElement,
  PickerToggleTrigger,
  onMenuKeyDown,
  useFocusItemValue,
  usePickerClassName,
  useSearch
} from '../Picker';
import { PickerInstance, PickerLocaleType } from '../Picker/types';
import { pickerToggleTriggerProps } from '../Picker/PickerToggleTrigger';
import { ItemDataType, FormControlPickerProps } from '../@types/common';
import { listPickerPropTypes } from '../Picker/propTypes';
import { SelectProps } from '../SelectPicker';
import { KEY_CODE } from '../constants';

export interface CheckPickerProps<T = (number | string)[]>
  extends FormControlPickerProps<T, PickerLocaleType, ItemDataType>,
    SelectProps<T> {
  /** Top the selected option in the options */
  sticky?: boolean;

  /** A picker that can be counted */
  countable?: boolean;
}

const defaultProps: Partial<CheckPickerProps> = {
  as: 'div',
  appearance: 'default',
  classPrefix: 'picker',
  countable: true,
  searchable: true,
  virtualized: true,
  cleanable: true,
  data: [],
  disabledItemValues: [],
  valueKey: 'value',
  labelKey: 'label',
  placement: 'bottomStart',
  menuAutoWidth: true,
  menuMaxHeight: 320
};

const CheckPicker = React.forwardRef((props: CheckPickerProps, ref: React.Ref<PickerInstance>) => {
  const {
    as: Component,
    classPrefix,
    countable,
    data,
    disabledItemValues,
    valueKey,
    labelKey,
    searchable,
    virtualized,
    cleanable,
    placement,
    menuAutoWidth,
    menuMaxHeight,
    menuClassName,
    menuStyle,
    locale: overrideLocale,
    placeholder,
    disabled,
    toggleAs,
    style,
    sticky,
    value,
    defaultValue,
    groupBy,
    listProps,
    renderMenuItem,
    renderMenuGroup,
    onSearch,
    onEnter,
    onEntered,
    onExited,
    onClean,
    onChange,
    onSelect,
    onClose,
    onOpen,
    onGroupTitleClick,
    renderValue,
    renderExtraFooter,
    renderMenu,
    sort,
    searchBy,
    ...rest
  } = props;

  const rootRef = useRef<HTMLDivElement>();
  const triggerRef = useRef<any>();
  const positionRef = useRef();
  const toggleRef = useRef<HTMLButtonElement>();
  const menuRef = useRef<HTMLDivElement>();
  const { locale } = useCustom<PickerLocaleType>('Picker', overrideLocale);

  const [valueState, setValue] = useState(clone(defaultValue) || []);
  const val = isUndefined(value) ? valueState : value;

  // Used to hover the focuse item  when trigger `onKeydown`
  const { focusItemValue, setFocusItemValue, onKeyDown } = useFocusItemValue(val?.[0], {
    data,
    valueKey,
    target: () => menuRef.current
  });

  const handleSearchCallback = useCallback(
    (searchKeyword: string, filteredData: ItemDataType[], event: React.SyntheticEvent<any>) => {
      // The first option after filtering is the focus.
      setFocusItemValue(filteredData?.[0]?.[valueKey]);
      onSearch?.(searchKeyword, event);
    },
    [setFocusItemValue, onSearch, valueKey]
  );

  // Use search keywords to filter options.
  const {
    searchKeyword,
    filteredData,
    setSearchKeyword,
    handleSearch,
    checkShouldDisplay
  } = useSearch({
    labelKey,
    data,
    searchBy,
    callback: handleSearchCallback
  });

  // Use component active state to support keyboard events.
  const [active, setActive] = useState(false);

  // A list of shortcut options.
  // when opened again, the selected options are displayed at the top.
  const [stickyItems, setStickyItems] = useState([]);

  const initStickyItems = () => {
    if (!sticky) {
      return;
    }

    let nextStickyItems = [];
    if (data && val.length) {
      nextStickyItems = data.filter(item => {
        return val.some(v => v === item[valueKey]);
      });
    }

    setStickyItems(nextStickyItems);
  };

  const handleClose = useCallback(() => {
    triggerRef.current?.hide?.();
    setFocusItemValue(val ? val[0] : undefined);
  }, [triggerRef, setFocusItemValue, val]);

  const handleOpen = useCallback(() => {
    triggerRef.current?.show?.();
  }, [triggerRef]);

  const handleToggleDropdown = () => {
    if (active) {
      handleClose();
      return;
    }
    handleOpen();
  };

  const handleChangeValue = useCallback(
    (value: any, event: React.SyntheticEvent<HTMLElement>) => {
      onChange?.(value, event);
    },
    [onChange]
  );

  const handleClean = useCallback(
    (event: React.SyntheticEvent<any>) => {
      if (disabled || !cleanable) {
        return;
      }
      setValue([]);
      handleChangeValue([], event);
    },
    [disabled, cleanable, handleChangeValue]
  );

  const selectFocusMenuItem = (event: React.KeyboardEvent<HTMLElement>) => {
    const nextValue = clone(val);

    if (!focusItemValue) {
      return;
    }

    if (!nextValue.some(v => shallowEqual(v, focusItemValue))) {
      nextValue.push(focusItemValue);
    } else {
      remove(nextValue, itemVal => shallowEqual(itemVal, focusItemValue));
    }

    const focusItem: any = data.find(item => shallowEqual(item?.[valueKey], focusItemValue));
    setValue(nextValue);
    handleSelect(nextValue, focusItem, event);
    handleChangeValue(nextValue, event);
  };

  const handleKeyDown = (event: React.KeyboardEvent<any>) => {
    // enter
    if ((!focusItemValue || !active) && event.keyCode === KEY_CODE.ENTER) {
      handleToggleDropdown();
    }

    // delete
    if (event.keyCode === KEY_CODE.BACKSPACE && event.target === toggleRef?.current) {
      handleClean(event);
    }

    if (!menuRef.current) {
      return;
    }
    onKeyDown(event);
    onMenuKeyDown(event, {
      enter: selectFocusMenuItem,
      esc: handleClose
    });
  };

  const handleSelect = useCallback(
    (nextItemValue: any, item: ItemDataType, event: React.SyntheticEvent<HTMLElement>) => {
      onSelect?.(nextItemValue, item, event);
    },
    [onSelect]
  );

  const handleItemSelect = useCallback(
    (nextItemValue: any, item: ItemDataType, event: React.MouseEvent<any>, checked: boolean) => {
      const nextValue = clone(val);

      if (checked) {
        nextValue.push(nextItemValue);
      } else {
        remove(nextValue, itemVal => shallowEqual(itemVal, nextItemValue));
      }

      setValue(nextValue);
      setFocusItemValue(nextItemValue);

      handleSelect(nextValue, item, event);
      handleChangeValue(nextValue, event);
    },
    [val, handleSelect, handleChangeValue, setFocusItemValue]
  );

  const handleExited = useCallback(() => {
    setSearchKeyword('');
    setFocusItemValue(null);
    setActive(false);
    onClose?.();
  }, [onClose, setFocusItemValue, setSearchKeyword]);

  const handleEntered = useCallback(() => {
    setActive(true);
    onOpen?.();
  }, [onOpen]);

  useImperativeHandle(ref, () => ({
    root: rootRef.current,
    get menu() {
      return menuRef.current;
    },
    get toggle() {
      return toggleRef.current;
    },
    open: handleOpen,
    close: handleClose
  }));

  const selectedItems =
    data.filter(item => val.some(val => shallowEqual(item[valueKey], val))) || [];

  /**
   * 1.Have a value and the value is valid.
   * 2.Regardless of whether the value is valid, as long as renderValue is set, it is judged to have a value.
   */
  const hasValue = selectedItems.length > 0 || (val?.length > 0 && isFunction(renderValue));

  const { prefix, merge } = useClassNames(classPrefix);

  let selectedElement = placeholder;

  if (selectedItems.length > 0) {
    selectedElement = (
      <SelectedElement
        selectedItems={selectedItems}
        countable={countable}
        valueKey={valueKey}
        labelKey={labelKey}
        prefix={prefix}
      />
    );
  }

  if (val?.length > 0 && isFunction(renderValue)) {
    selectedElement = renderValue(val, selectedItems, selectedElement);
  }

  const renderDropdownMenu = () => {
    const classes = merge(prefix('check-menu'), menuClassName);
    let items = filteredData;
    let filteredStickyItems = [];

    if (stickyItems) {
      filteredStickyItems = filterNodesOfTree(stickyItems, item => checkShouldDisplay(item));
      items = filterNodesOfTree(data, item => {
        return checkShouldDisplay(item) && !stickyItems.some(v => v[valueKey] === item[valueKey]);
      });
    }

    // Create a tree structure data when set `groupBy`
    if (groupBy) {
      items = getDataGroupBy(items, groupBy, sort);
    } else if (typeof sort === 'function') {
      items = items.sort(sort(false));
    }

    const menu =
      items.length || filteredStickyItems.length ? (
        <DropdownMenu
          listProps={listProps}
          disabledItemValues={disabledItemValues}
          valueKey={valueKey}
          labelKey={labelKey}
          renderMenuGroup={renderMenuGroup}
          renderMenuItem={renderMenuItem}
          maxHeight={menuMaxHeight}
          classPrefix={'picker-check-menu'}
          dropdownMenuItemAs={DropdownMenuItem}
          activeItemValues={val}
          focusItemValue={focusItemValue}
          data={[...filteredStickyItems, ...items]}
          group={!isUndefined(groupBy)}
          onSelect={handleItemSelect}
          onGroupTitleClick={onGroupTitleClick}
          virtualized={virtualized}
        />
      ) : (
        <div className={prefix`none`}>{locale?.noResultsText}</div>
      );

    return (
      <MenuWrapper
        ref={menuRef}
        autoWidth={menuAutoWidth}
        className={classes}
        style={menuStyle}
        onKeyDown={handleKeyDown}
        getToggleInstance={() => toggleRef.current}
        getPositionInstance={() => positionRef.current}
      >
        {searchable && (
          <SearchBar
            placeholder={locale?.searchPlaceholder}
            onChange={handleSearch}
            value={searchKeyword}
          />
        )}
        {renderMenu ? renderMenu(menu) : menu}
        {renderExtraFooter?.()}
      </MenuWrapper>
    );
  };

  const [classes, usedClassNameProps] = usePickerClassName({ ...props, hasValue, name: 'check' });

  return (
    <PickerToggleTrigger
      pickerProps={pick(props, pickerToggleTriggerProps)}
      ref={triggerRef}
      positionRef={positionRef}
      placement={placement}
      onEnter={createChainedFunction(initStickyItems, onEnter)}
      onEntered={createChainedFunction(handleEntered, onEntered)}
      onExited={createChainedFunction(handleExited, onExited)}
      speaker={renderDropdownMenu()}
    >
      <Component ref={rootRef} className={classes} style={style}>
        <PickerToggle
          {...omit(rest, [...pickerToggleTriggerProps, ...usedClassNameProps])}
          ref={toggleRef}
          onClean={createChainedFunction(handleClean, onClean)}
          onKeyDown={handleKeyDown}
          as={toggleAs}
          cleanable={cleanable && !disabled}
          hasValue={hasValue}
          active={active}
        >
          {selectedElement || locale?.placeholder}
        </PickerToggle>
      </Component>
    </PickerToggleTrigger>
  );
});

CheckPicker.displayName = 'CheckPicker';
CheckPicker.propTypes = {
  ...listPickerPropTypes,
  locale: PropTypes.any,
  appearance: PropTypes.oneOf(['default', 'subtle']),
  menuAutoWidth: PropTypes.bool,
  menuMaxHeight: PropTypes.number,
  renderMenu: PropTypes.func,
  renderMenuItem: PropTypes.func,
  renderMenuGroup: PropTypes.func,
  onSelect: PropTypes.func,
  onGroupTitleClick: PropTypes.func,
  onSearch: PropTypes.func,
  groupBy: PropTypes.any,
  sort: PropTypes.func,
  searchable: PropTypes.bool,
  countable: PropTypes.bool,
  sticky: PropTypes.bool,
  virtualized: PropTypes.bool,
  searchBy: PropTypes.func
};

CheckPicker.defaultProps = defaultProps;

export default CheckPicker;
