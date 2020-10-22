import React from 'react'
import { Image, Text, TouchableOpacity, ViewPropTypes } from 'react-native'
import PropTypes from 'prop-types'
import { moderateScale } from 'react-native-size-matters'
import styles from './styles'
import { AppStyles } from '../../themes'
import RadioButton from '../RadioButton/RadioButton'
import { CustomButton } from '../index'
import { getReqDetails } from '../../utils/sharedUtils'
import { FRIEND_STATUSES } from '../../constants/constants'
import PlaceholderItem from '../PlaceholderItem'
import I18n from '../../I18n'
import { navigateToUserProfile } from '../../utils/NavigationUtils'

function ViewContactItem(props) {
  const {
    item = {}, onPress, loading, loggedInUser = {}, isRadioVisible = false, friendId, onDeleteRequest, fetching, onUnblockContact, onUnmuteAccount
  } = props
  const { picture, name, fullName, id: contactId, friend } = item
  const { id: loggedInUserId = '' } = loggedInUser || {}
  const { id: requestFriendId = '', status } = friend || {}

  const activeOpacity = typeof onPress === 'function' ? 1 : 0.2
  const contactIcon = picture ? { uri: picture } : AppStyles.iconSet.profileFilled

  const isNotSelf = loggedInUserId !== contactId

  const onPressContact = () => {
    navigateToUserProfile(item)
  }

  const onPressRequest = () => {
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
    return <PlaceholderItem />
  }

  const { title, isHollow } = getReqDetails(status)

  return (
    <TouchableOpacity
      onPress={onPressContact}
      style={styles.itemContainer}
      activeOpacity={activeOpacity}
    >
      <Image
        source={contactIcon}
        style={styles.imageContainer}
        defaultSource={AppStyles.iconSet.profileFilled}
      />
      <Text style={[styles.nameStyle, props.nameStyle]}>{name || fullName}</Text>
      {isRadioVisible && (
        <RadioButton
          isActive={props.isRadio}
          circleStyle={styles.radioStyle}
          size={moderateScale(37)}
          color={AppStyles.colorSet.pinkI}
        />
      )}
      {!isRadioVisible && isNotSelf && (
        <CustomButton
          size="small"
          hollow={isHollow}
          onPress={onPressRequest}
          container={styles.followButton}
          loadingIndicatorColor={AppStyles.colorSet.pink}
          isLoading={(loading && String(friendId) === String(contactId))}
          title={I18n.t(title)}
          backgroundColor={AppStyles.colorSet.purple}
        />
      )}
    </TouchableOpacity>
  )
}

export default ViewContactItem

ViewContactItem.propTypes = {
  item: PropTypes.object,
  loggedInUser: PropTypes.object,
  isRadioVisible: PropTypes.bool,
  isRadio: PropTypes.bool,
  nameStyle: ViewPropTypes.style,
  onPressContact: PropTypes.func,
}

ViewContactItem.defaultProps = {
  item: {},
  loggedInUser: {},
  isRadioVisible: false,
  isRadio: false,
  nameStyle: {},
  onPressContact: () => {}
}
