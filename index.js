import React, { memo, useMemo } from 'react'
import { ActivityIndicator, Image, Text, TouchableOpacity, View, ViewPropTypes } from 'react-native'
import PropTypes from 'prop-types'
import styles from './styles'
import { AppStyles, Images } from '../../themes'
import { CustomButton } from '../index'
import { getReqDetails } from '../../utils/sharedUtils'
import { FRIEND_STATUSES, IMAGE_CROP_OPTIONS } from '../../constants/constants'
import FastImage from 'react-native-fast-image'
import { useNavigation } from '@react-navigation/native'
import { transformImage } from '../../utils/Transform'
import withPreventDoubleClick from '../../utils/withPreventDoubleClick'
import HighlightedText from '../HighlightedText'
import I18n from '../../I18n'
import { MAIN_SCREENS } from '../../constants'

const TouchableOpacityD = withPreventDoubleClick(TouchableOpacity)

function ViewContactItem(props) {
  const {
    item = {},
    onPress,
    onRemoveFollower,
    loading,
    loggedInUser = {},
    friendId,
    onDeleteRequest,
    onUnblockContact,
    onUnmuteAccount,
    disabled = false,
    containerStyle,
    buttonContainer,
    isOnBoarding = false,
    isSelfFollowersTab = false,
    isFollowAllowed,
    tabInfo,
    subText,
    isRoundItem = false,
    search,
    detailsContainerStyle,
    onLongPressItem,
    isWithoutTabScreen
  } = props
  const { TAB, currentTab, isRemoveAllowed } = tabInfo || {}
  const {
    picture, name, fullName, id: contactId, friend, follow, followersCount
  } = item
  const { id: loggedInUserId = '' } = loggedInUser || {}
  const { id: requestFriendId = '', status } = friend || {}
  const { status: followStatus } = follow || {}
  const contactIcon = picture ? {
    uri: transformImage(picture, 180, 180, false, 'png', 'image', IMAGE_CROP_OPTIONS.profile)
  } : Images.defaultUser
  const isNotSelf = loggedInUserId !== contactId
  const navigation = useNavigation()

  const onPressContact = () => {
    if (isWithoutTabScreen) {
      return onNavigateToWithoutTabScreens()
    }

    if (isNotSelf) {
      navigation.navigate('OtherUserProfile', item)
    } else {
      navigation.navigate('ProfileScreen', item)
    }
  }

  const onNavigateToWithoutTabScreens = () => {
    if (isNotSelf) {
      return navigation.navigate(MAIN_SCREENS.OTHER_USER_PROFILE_WITHOUT_TABS, item)
    }
    return navigation.navigate(MAIN_SCREENS.PROFILE_WITHOUT_TABS, item)

  }
  const onPressRequest = () => {
    if (isRemoveAllowed && currentTab === TAB.FOLLOWERS) {
      return onRemoveFollower?.(item)
    }
    if (!status || status === FRIEND_STATUSES.DELETED) {
      onPress?.(contactId)
    } else if (status === FRIEND_STATUSES.PENDING || status === FRIEND_STATUSES.FRIEND) {
      onDeleteRequest?.(requestFriendId, contactId)
    } else if (status && status === FRIEND_STATUSES.UNBLOCK) {
      onUnblockContact?.(contactId)
    } else if (status && status === FRIEND_STATUSES.UNMUTE) {
      onUnmuteAccount?.(contactId)
    }
  }

  const isLoading = loading && String(friendId) === String(contactId)

  if (isSelfFollowersTab && followStatus !== FRIEND_STATUSES.FRIEND) {
    return null
  }

  const { title, isHollow } = getReqDetails(status, follow, tabInfo)

  const renderContactDetails = useMemo(() => (
    <View style={[styles.nameContainer, !isOnBoarding && styles.nameStyleI, detailsContainerStyle]}>
      <HighlightedText
        mainContainerStyle={styles.nameMainContainer}
        searchWords={[search]}
        style={[styles.nameStyle, isRoundItem && { textAlign: 'center' }, props?.nameStyle]}
        numberOfLines={isRoundItem ? 1 : 3}>
        {name || fullName}
      </HighlightedText>
      { !!subText && (
        <Text numberOfLines={1} style={styles.subText}>{ subText }</Text>
      ) }
      {!!followersCount && (
        <Text numberOfLines={1} style={styles.subText}>{I18n.t('followedByDashPeople', { count: followersCount })}</Text>
      ) }
    </View>
  ), [search])

  if (isRoundItem) {
    return (
      <TouchableOpacityD
        onPress={onPressContact}
        style={[styles.roundItem, containerStyle]}
        disabled={disabled}
        key={contactId}
        activeOpacity={0.8}
    >
        <View style={styles.roundImageContainer}>
          <FastImage source={contactIcon} style={styles.roundUserImage} />
          <TouchableOpacityD
            activeOpacity={0.8}
            style={[styles.roundFollowButton, buttonContainer]}
            onPress={onPressRequest}>
            {isLoading ? (
              <View style={[styles.roundFollowIcon, { backgroundColor: isHollow ? AppStyles.colorSet.white : AppStyles.colorSet.purple }]}>
                <ActivityIndicator style={styles.roundFollowIcon} color={AppStyles.colorSet.pink} />
              </View>
            ) : (
              <Image
                source={status === FRIEND_STATUSES.FRIEND ? Images.purpleCircledTick : Images.greyCircledAdd}
                style={styles.roundFollowIcon} />
            )}
          </TouchableOpacityD>
        </View>
        {renderContactDetails}
      </TouchableOpacityD>
    )
  }

  return (
    <TouchableOpacityD
      onPress={onPressContact}
      style={[styles.itemContainer, !isOnBoarding && styles.itemContainerI, containerStyle]}
      disabled={disabled}
      key={contactId}
      onLongPress={onLongPressItem}
    >
      <FastImage
        source={contactIcon}
        style={[styles.imageContainer, isOnBoarding && styles.imageContainerI]}
        defaultSource={AppStyles.iconSet.profileFilled}
      />
      <View style={[styles.nameContainer, !isOnBoarding && styles.nameStyleI]}>
        <HighlightedText mainContainerStyle={styles.nameMainContainer} searchWords={[search]} style={[styles.nameStyle, props?.nameStyle || {}]} numberOfLines={3}>
          {name || fullName}
        </HighlightedText>
        { !!subText && (
          <Text numberOfLines={1} style={styles.subText}>{ subText }</Text>
        ) }
      </View>
      { isNotSelf && isFollowAllowed && (
        <CustomButton
          size="small"
          hollow={isHollow}
          onPress={onPressRequest}
          container={[styles.followButton, buttonContainer]}
          loadingIndicatorColor={AppStyles.colorSet.pink}
          isLoading={isLoading}
          title={title}
          backgroundColor={AppStyles.colorSet.purple}
        />
      ) }
    </TouchableOpacityD>
  )
}

const arePropsEqual = (prevProps, nextProps) => {
  if (prevProps.loading !== nextProps.loading && String(nextProps?.item?.id) === String(nextProps.friendId)) return false

  return (
    prevProps?.item === nextProps?.item
    && prevProps.disabled === nextProps.disabled
  )
}

export default memo(ViewContactItem, arePropsEqual)

ViewContactItem.propTypes = {
  item: PropTypes.object,
  loggedInUser: PropTypes.object,
  isRadioVisible: PropTypes.bool,
  isRadio: PropTypes.bool,
  nameStyle: ViewPropTypes.style,
  onPressContact: PropTypes.func,
  onLongPressItem: PropTypes.func,
  isOnBoarding: PropTypes.bool,
  isFollowAllowed: PropTypes.bool,
  isWithoutTabScreen: PropTypes.bool,
  containerStyle: PropTypes.object,
  buttonContainer: PropTypes.object,
  detailsContainerStyle: PropTypes.object,
}

ViewContactItem.defaultProps = {
  item: {},
  loggedInUser: {},
  isRadioVisible: false,
  isRadio: false,
  nameStyle: {},
  onPressContact: () => {},
  onLongPressItem: () => {},
  detailsContainerStyle: {},
  containerStyle: {},
  buttonContainer: {},
  isOnBoarding: false,
  isFollowAllowed: true,
  isWithoutTabScreen: false,
}
