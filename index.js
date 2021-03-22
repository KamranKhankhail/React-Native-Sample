import React, { memo, useCallback, useMemo } from 'react'
import {
  ActivityIndicator, Image, Text, TouchableOpacity, View, ViewPropTypes
} from 'react-native'
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
    isSelectUserFlow,
    isSelected,
    onSelectUser,
    actionButtonTitle
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
    if (typeof props.onPressContact === 'function') {
      return props.onPressContact(item)
    }
    if (isNotSelf) {
      navigation.navigate('OtherUserProfile', item)
    } else {
      navigation.navigate('ProfileScreen', item)
    }
  }

  const onPressRequest = () => {
    if (isSelectUserFlow) {
      return onSelectUser(item)
    }
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

  const getActionButtonTitle = () => {
    if (actionButtonTitle) {
      return { title: actionButtonTitle, isHollow: props.isHollow }
    }
    return getReqDetails(status, follow, tabInfo)
  }

  const { title, isHollow } = getActionButtonTitle()

  const renderContactDetails = useMemo(() => (
    <View style={[styles.nameContainer, !isOnBoarding && styles.nameStyleI, detailsContainerStyle]}>
      <HighlightedText
        mainContainerStyle={styles.nameMainContainer}
        searchWords={[search]}
        style={[styles.nameStyle, isRoundItem && { textAlign: 'center' }, props?.nameStyle]}
        numberOfLines={isRoundItem ? 2 : 3}>
        { name || fullName }
      </HighlightedText>
      { !!subText && (
        <Text numberOfLines={1} style={styles.subText}>{ subText }</Text>
      ) }
      { !!followersCount && (
        <Text
          numberOfLines={1}
          style={[styles.subText, props?.subTextStyle || {}]}>
          { `${followersCount} Followers` }
        </Text>
      ) }
    </View>
  ), [search])

  const renderActionIcon = useCallback(() => {
    if (isLoading) {
      return (
        <View
          style={[styles.roundFollowIcon, { backgroundColor: isHollow ? AppStyles.colorSet.white : AppStyles.colorSet.purple }]}>
          <ActivityIndicator style={styles.roundFollowIcon} color={AppStyles.colorSet.pink} />
        </View>
      )
    }
    return (
      <Image
        source={status === FRIEND_STATUSES.FRIEND ? Images.purpleCircledTick : Images.greyCircledAdd}
        style={styles.roundFollowIcon} />
    )
  }, [isLoading, isHollow, status])

  if (isRoundItem) {
    return (
      <TouchableOpacityD
        onPress={onPressContact}
        style={[styles.roundItem, containerStyle]}
        disabled={disabled}
        key={contactId}
        activeOpacity={0.8}
      >
        <View style={[styles.roundImageContainer]}>
          <FastImage source={contactIcon} style={styles.roundUserImage} />
          { isSelectUserFlow ? (
            <TouchableOpacity
              activeOpacity={0.8}
              style={[styles.roundFollowButton, buttonContainer]}
              onPress={onPressRequest}>
              <Image
                source={isSelected ? Images.purpleCircledTick : Images.greyCircledAdd}
                style={styles.roundFollowIcon} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacityD
              activeOpacity={0.8}
              style={[styles.roundFollowButton, buttonContainer]}
              onPress={onPressRequest}>
              { renderActionIcon() }
            </TouchableOpacityD>
          ) }
        </View>
        { renderContactDetails }
      </TouchableOpacityD>
    )
  }

  return (
    <TouchableOpacityD
      onPress={onPressContact}
      style={[styles.itemContainer, !isOnBoarding && styles.itemContainerI, containerStyle]}
      disabled={disabled}
      key={contactId}
    >
      <FastImage
        source={contactIcon}
        style={[styles.imageContainer, isOnBoarding && styles.imageContainerI]}
        defaultSource={AppStyles.iconSet.profileFilled}
      />
      <View style={[styles.nameContainer, !isOnBoarding && styles.nameStyleI]}>
        <HighlightedText
          mainContainerStyle={styles.nameMainContainer}
          searchWords={[search]}
          style={[styles.nameStyle, props?.nameStyle || {}]}
          numberOfLines={3}>
          { name || fullName }
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
    && prevProps.isSelected === nextProps.isSelected
    && prevProps.isHollow === nextProps.isHollow
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
  isOnBoarding: PropTypes.bool,
  isFollowAllowed: PropTypes.bool,
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
  detailsContainerStyle: {},
  containerStyle: {},
  buttonContainer: {},
  isOnBoarding: false,
  isFollowAllowed: true,
}
