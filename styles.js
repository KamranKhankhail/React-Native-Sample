import { StyleSheet } from 'react-native'
import { moderateScale, scale } from 'react-native-size-matters'
import { AppStyles, MetricsMod } from '../../themes'

export default StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: moderateScale(20),
    // height: MetricsMod.seventyFive
  },
  itemContainerI: {
    paddingBottom: moderateScale(24),
  },
  imageContainer: {
    width: moderateScale(50),
    height: moderateScale(50),
    backgroundColor: AppStyles.colorSet.sea,
    borderRadius: moderateScale(50) / 2
  },
  imageContainerI: {
    width: moderateScale(40),
    height: moderateScale(40),
    backgroundColor: AppStyles.colorSet.sea,
    borderRadius: moderateScale(40) / 2,
  },
  placeholderStyle: {
    padding: moderateScale(10),
    backgroundColor: AppStyles.colorSet.greyishII
  },
  nameContainer: {
    justifyContent: 'center',
    flex: 1,
  },
  nameStyle: {
    fontSize: AppStyles.fontSet.normal,
    color: AppStyles.colorSet.black,
  },
  nameStyleI: {
    marginLeft: scale(20),
  },
  subText: {
    fontWeight: '400',
    fontSize: AppStyles.fontSet.xsmall,
    lineHeight: MetricsMod.fifteen,
    letterSpacing: 0.44,
    color: AppStyles.colorSet.greyishXXI
  },
  radioStyle: {
    width: moderateScale(30),
    height: moderateScale(30),
    backgroundColor: 'rgb(243,244,250)'
  },
  followButton: {
    minWidth: MetricsMod.hundredTen,
    height: MetricsMod.twentyEight,
    marginLeft: MetricsMod.smallMargin,
    borderWidth: 1,
    borderColor: AppStyles.colorSet.purple,
  },
})
