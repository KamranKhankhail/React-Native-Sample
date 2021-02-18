import React, { memo } from 'react'
import { Text, TouchableOpacity, View, ViewPropTypes } from 'react-native'
import PropTypes from 'prop-types'
import styles from './styles'
import { AppStyles } from '../../themes'
import { CustomButton } from '../index'
import { getReqDetails } from '../../utils/sharedUtils'
import { FRIEND_STATUSES } from '../../constants/constants'
import FastImage from 'react-native-fast-image'
import { useNavigation } from '@react-navigation/native'
import { transformImage } from '../../utils/Transform'
import withPreventDoubleClick from '../../utils/withPreventDoubleClick'

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
    isFollowAllowed = true,
    tabInfo,
    subText,
  } = props
  const { TAB, currentTab, isRemoveAllowed } = tabInfo || {}
  const {
    picture, name, fullName, id: contactId, friend, follow
  } = item
  const { id: loggedInUserId = '' } = loggedInUser || {}
  const { id: requestFriendId = '', status } = friend || {}
  const { status: followStatus } = follow || {}
  const contactIcon = picture ? { uri: transformImage(picture) } : AppStyles.iconSet.profileFilled
  const isNotSelf = loggedInUserId !== contactId
  const navigation = useNavigation()

  const onPressContact = () => {
    if (isNotSelf) {
      navigation.push('OtherUserProfile', item)
    } else {
      navigation.navigate('ProfileScreen', item)
    }
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

  if (isSelfFollowersTab && followStatus !== FRIEND_STATUSES.FRIEND) {
    return null
  }

  const { title, isHollow } = getReqDetails(status, follow, tabInfo)

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
        <Text style={[styles.nameStyle, props.nameStyle]} numberOfLines={3}>
          { name || fullName }
        </Text>
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
          isLoading={(loading && String(friendId) === String(contactId))}
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
  isOnBoarding: PropTypes.bool,
  containerStyle: PropTypes.object,
  buttonContainer: PropTypes.object,
}

ViewContactItem.defaultProps = {
  item: {},
  loggedInUser: {},
  isRadioVisible: false,
  isRadio: false,
  nameStyle: {},
  onPressContact: () => {},
  containerStyle: {},
  buttonContainer: {},
  isOnBoarding: false,
}
