import React from 'react'
import { Text, TouchableOpacity, ViewPropTypes } from 'react-native'
import PropTypes from 'prop-types'
import styles from './styles'
import { AppStyles } from '../../themes'
import { CustomButton } from '../index'
import { getReqDetails } from '../../utils/sharedUtils'
import { FRIEND_STATUSES } from '../../constants/constants'
import FastImage from 'react-native-fast-image'
import { withNavigation } from 'react-navigation'
import PlaceholderContact from '../PlaceholderContact'

function ViewContactItem (props) {
  const {
    item = {}, onPress, loading, loggedInUser = {}, friendId, onDeleteRequest = () => {}, fetching, onUnblockContact, onUnmuteAccount,
    disabled = false, containerStyle, buttonContainer, isOnBoarding = false, isSelfFollowersTab = false
  } = props
  const {
    picture, name, fullName, id: contactId, friend, follow
  } = item
  const { id: loggedInUserId = '' } = loggedInUser || {}
  const { id: requestFriendId = '', status } = friend || {}
  const { id: requestFollowId = '', status: followStatus } = follow || {}
  const contactIcon = picture ? { uri: picture } : AppStyles.iconSet.profileFilled
  const isNotSelf = loggedInUserId !== contactId

  const onPressContact = () => {
    const screen = isNotSelf ? 'OtherUserProfile' : 'ProfileScreen'
    props.navigation.push(screen, item)
  }

  const onPressRequest = () => {
    if (isSelfFollowersTab) {
      return onDeleteRequest(requestFollowId, contactId, item)
    }
    if (!status || status === FRIEND_STATUSES.DELETED) {
      onPress(contactId)
    } else if (status === FRIEND_STATUSES.PENDING || status === FRIEND_STATUSES.FRIEND) {
      onDeleteRequest(requestFriendId, contactId)
    } else if (status && status === FRIEND_STATUSES.UNBLOCK) {
      onUnblockContact(contactId)
    } else if (status && status === FRIEND_STATUSES.UNMUTE) {
      onUnmuteAccount(contactId)
    }
  }

  if (fetching) {
    return <PlaceholderContact/>
  }

  if (isSelfFollowersTab && followStatus !== FRIEND_STATUSES.FRIEND) {
    return null
  }

  const { title, isHollow } = getReqDetails(status, follow, isSelfFollowersTab)

  return (
    <TouchableOpacity
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
      <Text style={[styles.nameStyle, props.nameStyle, !isOnBoarding && styles.nameStyleI]} numberOfLines={3}>{name || fullName}</Text>
      {isNotSelf && (
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
      )}
    </TouchableOpacity>
  )
}

export default withNavigation(ViewContactItem)

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
