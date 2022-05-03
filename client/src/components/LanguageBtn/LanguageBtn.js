import{useState} from "react";
import LanguageIcon from "@mui/icons-material/Language";
import IconButton from '@mui/material/IconButton';
import { useTranslation } from "react-i18next";
import {Menu, MenuItem,  } from "@mui/material";
import "../../i18next";

import ru from "./russia.png";
import en from "./united_kingdom.png";
import "./language.css";

const LanguageBtn = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const { t, i18n } = useTranslation();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };

  return (
    <>
      <IconButton onClick={handleClick} aria-label="delete" size="large">
        <LanguageIcon fontSize="inherit" />
      </IconButton>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={() => {changeLanguage("ru"); handleClose()}}><img className="flag" src={ru} alt="flag"/>Русский</MenuItem>
        <MenuItem onClick={() => {changeLanguage("en"); handleClose()}}><img className="flag" src={en} alt="flag"/>English</MenuItem>
      </Menu>
    </>
  );
}

export default LanguageBtn;
