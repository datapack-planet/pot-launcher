import React, { useEffect, useState } from 'react';
import TitleBar from './main/TitleBar';
import Body from './main/Body';
import Welcome from './welcome/Welcome';
import { IntlProvider } from 'react-intl';
import { ThemeProvider } from '@material-ui/core';
import { createMuiTheme } from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';
import OpeningScreen from './open/OpeningScreen';

// region type declarations
export enum AccountType {
  no,
  microsoft,
  mojang,
  offline,
  injector,
}

type StateSetter<T> = React.Dispatch<React.SetStateAction<T>>;

export interface IAppProps {
  welcome?: boolean;
  opening?: boolean;
  strings?: Record<string, string>;
}

interface IStateContext {
  accountName?: string;
  accountType?: AccountType;
  setAccountName?: StateSetter<string>;
  setAccountType?: StateSetter<AccountType>;
}
// endregion

// custom the mui theme with user select
// but default is blue
const theme = createMuiTheme({
  palette: {
    primary: localStorage.color ? JSON.parse(localStorage.color) : blue,
  },
  typography: {
    fontFamily: ['-apple-system', 'BlinkMacSystemFont', '"Inter"', '"Helvetica Neue"', 'Arial', 'sans-serif'].join(
      ', '
    ),
    allVariants: {
      textTransform: 'none',
    },
  },
});

// use this to share public state to its children elements
export const PublicStates = React.createContext<IStateContext>({});

export default function App(props: IAppProps): React.ReactElement {
  // region public states
  const [accountType, setAccountType] = useState<AccountType>(localStorage.accountType ?? AccountType.no);
  const [accountName, setAccountName] = useState<string>('Guest');
  // endregion

  // region account saver
  useEffect(() => {
    localStorage.accountType = accountType;
    localStorage.accountName = accountName;
  }, [accountType, accountName]);
  // endregion

  const welcome = !!props.welcome;
  const opening = !!props.opening;
  const { strings } = props;
  const { locale } = localStorage;
  console.log(strings);

  useEffect(() => {
    // Set lang attribute if locale was configured
    locale && (document.getElementById('root').lang = locale);
  }, []);

  return (
    <PublicStates.Provider value={{ accountName, accountType, setAccountName, setAccountType }}>
      <IntlProvider locale={locale} messages={strings} defaultLocale="zh-CN">
        <ThemeProvider theme={theme}>
          <TitleBar />
          {welcome && <Welcome />}
          {opening && <OpeningScreen />}
          {!(welcome || opening) && <Body />}
        </ThemeProvider>
      </IntlProvider>
    </PublicStates.Provider>
  );
}
