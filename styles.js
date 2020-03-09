import { StyleSheet } from 'react-native';
import { moderateScale, scale } from 'react-native-size-matters';
import { AppStyles } from '../../themes';

export default StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: moderateScale(24)
  },
  imageContainer: {
    width: moderateScale(50),
    height: moderateScale(50),
    borderRadius: moderateScale(50) / 2
  },
  placeholderStyle: {
    padding: moderateScale(10),
    backgroundColor: AppStyles.colorSet.greyishII
  },
  nameStyle: {
    flex: 1,
    marginLeft: scale(20),
    fontSize: AppStyles.fontSet.normal,
    color: AppStyles.colorSet.black,
    fontFamily: AppStyles.fontFamily.corbelRegular
  },
  radioStyle: {
    width: moderateScale(30),
    height: moderateScale(30),
    backgroundColor: 'rgb(243,244,250)'
  }
});
