import { StyleSheet } from 'react-native'
import { moderateScale, scale } from 'react-native-size-matters'
import { AppStyles, MetricsMod } from '../../themes'

export default StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: moderateScale(20),
  },
  nameMainContainer: {
    flex: 0,
  },
  roundItem: {
    overflow: 'hidden',
    alignItems: 'center',
    flex: 1,
    marginVertical: MetricsMod.baseMargin,
  },
  roundImageContainer: {
    margin: MetricsMod.baseMargin,
    width: MetricsMod.eighty,
    height: MetricsMod.eighty,
    borderRadius: MetricsMod.eighty / 2,
  },
  roundUserImage: {
    width: MetricsMod.seventy,
    height: MetricsMod.seventy,
    borderRadius: MetricsMod.seventy / 2,
    resizeMode: 'cover',
  },
  roundFollowButton: {
    position: 'absolute',
    bottom: 5,
    right: 5,
  },
  roundFollowIcon: {
    width: MetricsMod.twentyFive,
    height: MetricsMod.twentyFive,
    borderRadius: MetricsMod.twentyFive / 2,
    borderWidth: 1,
    borderColor: AppStyles.colorSet.white
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
    width: '100%',
    fontSize: AppStyles.fontSet.mediumI,
    color: AppStyles.colorSet.black,
  },
  nameStyleI: {
    marginLeft: scale(20),
  },
  subText: {
    textAlign: 'center',
    fontWeight: '400',
    fontSize: AppStyles.fontSet.xsmall,
    lineHeight: MetricsMod.fifteen,
    letterSpacing: 0.44,
    color: AppStyles.colorSet.blackN,
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
