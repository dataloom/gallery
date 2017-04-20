import moment from 'moment';
import EdmConsts from '../../utils/Consts/EdmConsts';

export function formatDate(date) {
  const dateObj = moment(date);
  return (dateObj.isValid()) ? dateObj.format('MM/DD/YYYY') : date;
}

export function getTickFormatter(props) {
  let shouldFormatDate = false;
  props.forEach((prop) => {
    if (EdmConsts.EDM_DATE_TYPES.includes(prop.datatype)) {
      shouldFormatDate = true;
    }
  });
  if (shouldFormatDate) return formatDate;
  return (num) => {
    return num;
  };
}
